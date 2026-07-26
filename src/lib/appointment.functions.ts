import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2, "Введіть імʼя").max(80),
  phone: z
    .string()
    .trim()
    .min(6, "Введіть номер телефону")
    .max(30)
    .regex(/^[+\d\s()\-]+$/, "Некоректний номер"),
  comment: z.string().trim().max(500).optional().nullable(),
});

export const submitAppointment = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => schema.parse(input))
  .handler(async ({ data }) => {
    const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
    const TELEGRAM_API_KEY = process.env.TELEGRAM_API_KEY;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!LOVABLE_API_KEY || !TELEGRAM_API_KEY) {
      throw new Error("Telegram інтеграція не налаштована. Спробуйте пізніше.");
    }
    if (!TELEGRAM_CHAT_ID) {
      throw new Error(
        "TELEGRAM_CHAT_ID не задано. Адміністратор має додати chat_id секретом.",
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
    ]
      .filter(Boolean)
      .join("\n");

    const res = await fetch(
      "https://connector-gateway.lovable.dev/telegram/sendMessage",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "X-Connection-Api-Key": TELEGRAM_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text,
          parse_mode: "HTML",
        }),
      },
    );

    if (!res.ok) {
      const body = await res.text();
      console.error("Telegram sendMessage failed", res.status, body);
      throw new Error("Не вдалося відправити заявку. Спробуйте ще раз.");
    }
    const json = (await res.json()) as { ok: boolean; description?: string };
    if (!json.ok) {
      console.error("Telegram non-ok", json);
      throw new Error(json.description || "Не вдалося відправити заявку.");
    }

    return { ok: true };
  });

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
