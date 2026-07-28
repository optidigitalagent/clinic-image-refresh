import assert from "node:assert/strict";
import test from "node:test";

import {
  createApp,
  formatTelegramMessage,
  parseTelegramChatIds,
  validateAppointment,
} from "./app.mjs";

const env = {
  TELEGRAM_BOT_TOKEN: "test-token",
  TELEGRAM_CHAT_ID: "123456",
  ALLOWED_ORIGINS: "https://optidigitalagent.github.io,https://amidental.example",
};

const quietLogger = { info() {}, error() {} };

test("validates and normalizes appointment data", () => {
  assert.deepEqual(
    validateAppointment({
      name: "  Ольга Петренко  ",
      phone: " +38 (068) 670-75-19 ",
      comment: "  Консультація  ",
    }),
    {
      name: "Ольга Петренко",
      phone: "+38 (068) 670-75-19",
      comment: "Консультація",
    },
  );
});

test("escapes user content in Telegram HTML", () => {
  const message = formatTelegramMessage(
    { name: "<Ольга>", phone: "+380000000000", comment: "A & B" },
    new Date("2026-07-26T10:00:00.000Z"),
  );

  assert.match(message, /&lt;Ольга&gt;/);
  assert.match(message, /A &amp; B/);
  assert.doesNotMatch(message, /<Ольга>/);
});

test("accepts a website submission and sends it to Telegram", async () => {
  let telegramRequest;
  const app = createApp({
    env,
    logger: quietLogger,
    fetchImpl: async (url, options) => {
      telegramRequest = { url, options };
      return Response.json({ ok: true, result: { message_id: 1 } });
    },
  });

  const response = await app(
    new Request("https://service.example/api/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://optidigitalagent.github.io",
        "X-Forwarded-For": "203.0.113.10",
      },
      body: JSON.stringify({ name: "Ольга Петренко", phone: "+380686707519", comment: "" }),
    }),
  );

  assert.equal(response.status, 201);
  assert.equal(
    response.headers.get("access-control-allow-origin"),
    "https://optidigitalagent.github.io",
  );
  assert.match(telegramRequest.url, /api\.telegram\.org\/bottest-token\/sendMessage$/);
  const telegramBody = JSON.parse(telegramRequest.options.body);
  assert.equal(telegramBody.chat_id, "123456");
  assert.match(telegramBody.text, /Ольга Петренко/);
});

test("parses comma and whitespace-separated Telegram IDs without duplicates", () => {
  assert.deepEqual(parseTelegramChatIds(" 111, 222\n111\t333 ,, ", "222"), ["111", "222", "333"]);
});

test("sends the same appointment to two Telegram recipients", async () => {
  const telegramBodies = [];
  const app = createApp({
    env: { ...env, TELEGRAM_CHAT_IDS: "111,222", TELEGRAM_CHAT_ID: "" },
    logger: quietLogger,
    fetchImpl: async (_url, options) => {
      telegramBodies.push(JSON.parse(options.body));
      return Response.json({ ok: true, result: { message_id: telegramBodies.length } });
    },
  });

  const response = await submitAppointment(app);

  assert.equal(response.status, 201);
  assert.deepEqual(
    telegramBodies.map(({ chat_id }) => chat_id),
    ["111", "222"],
  );
  assert.equal(telegramBodies[0].text, telegramBodies[1].text);
});

test("returns success when at least one Telegram recipient receives the appointment", async () => {
  const logs = [];
  const app = createApp({
    env: { ...env, TELEGRAM_CHAT_IDS: "111,222", TELEGRAM_CHAT_ID: "" },
    logger: {
      info(message, data) {
        logs.push({ level: "info", message, data });
      },
      error(message, data) {
        logs.push({ level: "error", message, data });
      },
    },
    fetchImpl: async (_url, options) => {
      const { chat_id: chatId } = JSON.parse(options.body);
      return chatId === "111"
        ? Response.json({ ok: false }, { status: 500 })
        : Response.json({ ok: true, result: { message_id: 1 } });
    },
  });

  const response = await submitAppointment(app);

  assert.equal(response.status, 201);
  assert.deepEqual(logs, [
    {
      level: "info",
      message: "Telegram delivery summary",
      data: { recipientsConfigured: 2, delivered: 1, failed: 1 },
    },
  ]);
});

test("returns a safe error when every Telegram delivery fails", async () => {
  const logs = [];
  const app = createApp({
    env: { ...env, TELEGRAM_CHAT_IDS: "111,222", TELEGRAM_CHAT_ID: "" },
    logger: {
      info() {},
      error(message, data) {
        logs.push({ message, data });
      },
    },
    fetchImpl: async () => Response.json({ ok: false }, { status: 500 }),
  });

  const response = await submitAppointment(app);

  assert.equal(response.status, 502);
  assert.deepEqual(await response.json(), {
    ok: false,
    error: "Не вдалося надіслати заявку. Спробуйте ще раз",
  });
  assert.deepEqual(logs, [
    {
      message: "Telegram delivery summary",
      data: { recipientsConfigured: 2, delivered: 0, failed: 2 },
    },
  ]);
});

test("returns a safe service error when Telegram variables are missing", async () => {
  const incompleteEnvironments = [
    {},
    { TELEGRAM_BOT_TOKEN: "test-token" },
    { TELEGRAM_CHAT_IDS: "111" },
    { TELEGRAM_BOT_TOKEN: "test-token", TELEGRAM_CHAT_IDS: " ,  \n " },
  ];

  for (const incompleteEnv of incompleteEnvironments) {
    const app = createApp({ env: incompleteEnv, logger: quietLogger });
    const response = await submitAppointment(app);

    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), {
      ok: false,
      error: "Сервіс заявок тимчасово недоступний",
    });
  }
});

test("rejects requests from an unapproved website", async () => {
  const app = createApp({ env });
  const response = await app(
    new Request("https://service.example/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: "https://evil.example" },
      body: JSON.stringify({ name: "Ольга Петренко", phone: "+380686707519" }),
    }),
  );

  assert.equal(response.status, 403);
  assert.equal(response.headers.get("access-control-allow-origin"), null);
});

test("healthcheck recognizes both multi-recipient and legacy Telegram configuration", async () => {
  const environments = [
    [{}, false],
    [{ TELEGRAM_BOT_TOKEN: "test-token", TELEGRAM_CHAT_IDS: "" }, false],
    [{ TELEGRAM_CHAT_IDS: "111,222" }, false],
    [{ TELEGRAM_BOT_TOKEN: "test-token", TELEGRAM_CHAT_IDS: "111,222" }, true],
    [{ TELEGRAM_BOT_TOKEN: "test-token", TELEGRAM_CHAT_ID: "111" }, true],
  ];

  for (const [healthEnv, telegramConfigured] of environments) {
    const app = createApp({ env: healthEnv, logger: quietLogger });
    const response = await app(new Request("https://service.example/health"));

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: true, telegramConfigured });
  }
});

function submitAppointment(app) {
  return app(
    new Request("https://service.example/api/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://optidigitalagent.github.io",
        "X-Forwarded-For": "203.0.113.10",
      },
      body: JSON.stringify({
        name: "Тест переноса Railway",
        phone: "+380000000000",
        comment: "Техническая проверка нового сервиса. Не связываться.",
      }),
    }),
  );
}
