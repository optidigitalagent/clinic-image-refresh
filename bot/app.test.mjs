import assert from "node:assert/strict";
import test from "node:test";

import { createApp, formatTelegramMessage, validateAppointment } from "./app.mjs";

const env = {
  TELEGRAM_BOT_TOKEN: "test-token",
  TELEGRAM_CHAT_ID: "123456",
  ALLOWED_ORIGINS: "https://optidigitalagent.github.io,https://amidental.example",
};

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
  assert.equal(response.headers.get("access-control-allow-origin"), "https://optidigitalagent.github.io");
  assert.match(telegramRequest.url, /api\.telegram\.org\/bottest-token\/sendMessage$/);
  const telegramBody = JSON.parse(telegramRequest.options.body);
  assert.equal(telegramBody.chat_id, "123456");
  assert.match(telegramBody.text, /Ольга Петренко/);
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

test("healthcheck stays available while reporting secret configuration", async () => {
  const app = createApp({ env: {} });
  const response = await app(new Request("https://service.example/health"));

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true, telegramConfigured: false });
});
