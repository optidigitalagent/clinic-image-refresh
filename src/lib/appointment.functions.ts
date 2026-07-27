import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2, "Введіть імʼя").max(80),
  phone: z.string().trim().min(6, "Введіть номер телефону").max(30)
    .regex(/^[+\d\s()\-]+$/, "Некоректний номер"),
  comment: z.string().trim().max(500).optional().nullable(),
});

export const submitAppointment = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => schema.parse(input))
  .handler(async ({ data }) => {
    const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
    const TELEGRAM_API_KEY = process.env.TELEGRAM_API_KEY;
    // Підтримка декількох отримувачів: TELEGRAM_CHAT_IDS="123,456,789"
    // Для сумісності також читаємо старий TELEGRAM_CHAT_ID.
    const raw =
      process.env.TELEGRAM_CHAT_IDS ?? process.env.TELEGRAM_CHAT_ID ?? "";
    const chatIds = raw.split(/[,\s]+/).map((s) => s.trim()).filter(Boolean);

    if (!LOVABLE_API_KEY || !TELEGRAM_API_KEY) {
      throw new Error("Telegram інтеграція не налаштована. Спробуйте пізніше.");
    }
    if (chatIds.length === 0) {
      throw new Error(
        "TELEGRAM_CHAT_IDS не задано. Адміністратор має додати chat_id секретом.",
      );
    }

    const text = [
      "🦷 <b>Нова заявка Ami Dental</b>",
      "",
      `👤 <b>Імʼя:</b> ${escapeHtml(data.name)}`,
      `📞 <b>Телефон:</b> ${escapeHtml(data.phone)}`,
      data.comment ? `💬 <b>Коментар:</b> ${escapeHtml(data.comment)}` : null,
      "",
      `🕒 ${new Date().toLocaleString("uk-UA", { timeZone: "Europe/Kyiv" })}`,
    ].filter(Boolean).join("\n");

    const results = await Promise.allSettled(
      chatIds.map(async (chat_id) => {
        const res = await fetch(
          "https://connector-gateway.lovable.dev/telegram/sendMessage",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${LOVABLE_API_KEY}`,
              "X-Connection-Api-Key": TELEGRAM_API_KEY,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ chat_id, text, parse_mode: "HTML" }),
          },
        );
        if (!res.ok) {
          const body = await res.text();
          console.error("Telegram sendMessage failed", chat_id, res.status, body);
          throw new Error(`send failed ${chat_id}`);
        }
        const json = (await res.json()) as { ok: boolean; description?: string };
        if (!json.ok) {
          console.error("Telegram non-ok", chat_id, json);
          throw new Error(json.description || "send failed");
        }
      }),
    );

    const okCount = results.filter((r) => r.status === "fulfilled").length;
    if (okCount === 0) {
      throw new Error("Не вдалося відправити заявку. Спробуйте ще раз.");
    }
    return { ok: true, delivered: okCount, total: chatIds.length };
  });

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
