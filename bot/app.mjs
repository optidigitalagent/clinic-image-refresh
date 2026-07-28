const DEFAULT_ALLOWED_ORIGINS = ["https://optidigitalagent.github.io"];
const MAX_BODY_BYTES = 16 * 1024;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

export function createApp({
  env = process.env,
  fetchImpl = fetch,
  now = Date.now,
  logger = console,
} = {}) {
  const rateLimiter = createRateLimiter({ now });
  const telegramChatIds = parseTelegramChatIds(env.TELEGRAM_CHAT_IDS, env.TELEGRAM_CHAT_ID);

  return async function handleRequest(request) {
    const url = new URL(request.url);

    if (url.pathname === "/health" && request.method === "GET") {
      return jsonResponse({
        ok: true,
        telegramConfigured: Boolean(env.TELEGRAM_BOT_TOKEN && telegramChatIds.length),
      });
    }

    if (url.pathname !== "/api/appointments") {
      return jsonResponse({ ok: false, error: "Not found" }, { status: 404 });
    }

    const origin = request.headers.get("origin");
    const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);
    const corsHeaders = getCorsHeaders(origin, allowedOrigins);

    if (request.method === "OPTIONS") {
      if (origin && !corsHeaders) {
        return jsonResponse({ ok: false, error: "Origin not allowed" }, { status: 403 });
      }

      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    if (request.method !== "POST") {
      return jsonResponse(
        { ok: false, error: "Method not allowed" },
        { status: 405, headers: corsHeaders, extraHeaders: { Allow: "POST, OPTIONS" } },
      );
    }

    if (origin && !corsHeaders) {
      return jsonResponse({ ok: false, error: "Origin not allowed" }, { status: 403 });
    }

    if (!env.TELEGRAM_BOT_TOKEN || !telegramChatIds.length) {
      return jsonResponse(
        { ok: false, error: "Сервіс заявок тимчасово недоступний" },
        { status: 503, headers: corsHeaders },
      );
    }

    const clientIp = getClientIp(request);
    const rateLimit = rateLimiter.consume(clientIp);

    if (!rateLimit.allowed) {
      return jsonResponse(
        { ok: false, error: "Забагато спроб. Спробуйте ще раз пізніше" },
        {
          status: 429,
          headers: corsHeaders,
          extraHeaders: { "Retry-After": String(rateLimit.retryAfterSeconds) },
        },
      );
    }

    let data;
    try {
      const body = await readJsonBody(request);
      data = validateAppointment(body);
    } catch (error) {
      const status = error instanceof RequestError ? error.status : 400;
      const message = error instanceof Error ? error.message : "Некоректні дані заявки";
      return jsonResponse({ ok: false, error: message }, { status, headers: corsHeaders });
    }

    try {
      const delivery = await sendTelegramAppointment(data, {
        botToken: env.TELEGRAM_BOT_TOKEN,
        chatIds: telegramChatIds,
        fetchImpl,
      });

      const logData = {
        recipientsConfigured: telegramChatIds.length,
        delivered: delivery.delivered,
        failed: delivery.failed,
      };

      if (!delivery.delivered) {
        logger.error("Telegram delivery summary", logData);
        return jsonResponse(
          { ok: false, error: "Не вдалося надіслати заявку. Спробуйте ще раз" },
          { status: 502, headers: corsHeaders },
        );
      }

      logger.info("Telegram delivery summary", logData);
    } catch {
      logger.error("Telegram delivery summary", {
        recipientsConfigured: telegramChatIds.length,
        delivered: 0,
        failed: telegramChatIds.length,
      });
      return jsonResponse(
        { ok: false, error: "Не вдалося надіслати заявку. Спробуйте ще раз" },
        { status: 502, headers: corsHeaders },
      );
    }

    return jsonResponse({ ok: true }, { status: 201, headers: corsHeaders });
  };
}

export function parseTelegramChatIds(chatIds, legacyChatId) {
  return [chatIds, legacyChatId]
    .filter((value) => typeof value === "string")
    .flatMap((value) => value.split(/[\s,]+/))
    .map((chatId) => chatId.trim())
    .filter((chatId, index, values) => chatId && values.indexOf(chatId) === index);
}

export function validateAppointment(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new RequestError("Некоректні дані заявки", 400);
  }

  const name = typeof input.name === "string" ? input.name.trim() : "";
  const phone = typeof input.phone === "string" ? input.phone.trim() : "";
  const comment = typeof input.comment === "string" ? input.comment.trim() : "";

  if (name.length < 2 || name.length > 80) {
    throw new RequestError("Введіть імʼя та прізвище", 400);
  }

  if (phone.length < 6 || phone.length > 30 || !/^[+\d\s()\-]+$/.test(phone)) {
    throw new RequestError("Введіть коректний номер телефону", 400);
  }

  const digitCount = (phone.match(/\d/g) ?? []).length;
  if (digitCount < 6 || digitCount > 15) {
    throw new RequestError("Введіть коректний номер телефону", 400);
  }

  if (comment.length > 500) {
    throw new RequestError("Коментар надто довгий", 400);
  }

  return { name, phone, comment: comment || null };
}

export function formatTelegramMessage(data, date = new Date()) {
  return [
    "🦷 <b>Нова заявка Ami Dental</b>",
    "",
    `👤 <b>Імʼя та прізвище:</b> ${escapeHtml(data.name)}`,
    `📞 <b>Телефон:</b> ${escapeHtml(data.phone)}`,
    data.comment ? `💬 <b>Коментар:</b> ${escapeHtml(data.comment)}` : null,
    "",
    `🕒 ${date.toLocaleString("uk-UA", { timeZone: "Europe/Kyiv" })}`,
  ]
    .filter(Boolean)
    .join("\n");
}

async function sendTelegramAppointment(data, { botToken, chatIds, fetchImpl }) {
  const text = formatTelegramMessage(data);
  const deliveries = await Promise.allSettled(
    chatIds.map((chatId) => sendTelegramMessage({ botToken, chatId, text, fetchImpl })),
  );

  const delivered = deliveries.filter((delivery) => delivery.status === "fulfilled").length;
  return { delivered, failed: deliveries.length - delivered };
}

async function sendTelegramMessage({ botToken, chatId, text, fetchImpl }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetchImpl(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
      signal: controller.signal,
    });

    const result = await response.json().catch(() => null);
    if (!response.ok || !result?.ok) {
      throw new Error(`Telegram API returned ${response.status}`);
    }
  } finally {
    clearTimeout(timeout);
  }
}

async function readJsonBody(request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    throw new RequestError("Очікується JSON", 415);
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    throw new RequestError("Заявка надто велика", 413);
  }

  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > MAX_BODY_BYTES) {
    throw new RequestError("Заявка надто велика", 413);
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new RequestError("Некоректний JSON", 400);
  }
}

function parseAllowedOrigins(value) {
  const configured = value
    ?.split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean);

  return new Set(configured?.length ? configured : DEFAULT_ALLOWED_ORIGINS);
}

function getCorsHeaders(origin, allowedOrigins) {
  if (!origin || !allowedOrigins.has(origin)) return undefined;

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function getClientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

function createRateLimiter({ now }) {
  const requests = new Map();

  return {
    consume(key) {
      const timestamp = now();
      const current = requests.get(key);

      if (!current || timestamp >= current.resetAt) {
        requests.set(key, { count: 1, resetAt: timestamp + RATE_LIMIT_WINDOW_MS });
        return { allowed: true, retryAfterSeconds: 0 };
      }

      if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
        return {
          allowed: false,
          retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - timestamp) / 1000)),
        };
      }

      current.count += 1;
      return { allowed: true, retryAfterSeconds: 0 };
    },
  };
}

function jsonResponse(body, { status = 200, headers, extraHeaders } = {}) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      ...headers,
      ...extraHeaders,
    },
  });
}

function escapeHtml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

class RequestError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}
