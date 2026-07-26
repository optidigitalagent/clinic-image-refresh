import { createServer } from "node:http";
import { Readable } from "node:stream";

import { createApp } from "./app.mjs";

const port = Number(process.env.PORT || 3000);
const handleRequest = createApp();

const server = createServer(async (incoming, outgoing) => {
  try {
    const method = incoming.method || "GET";
    const request = new Request(
      new URL(incoming.url || "/", `http://${incoming.headers.host || "localhost"}`),
      {
        method,
        headers: incoming.headers,
        body: method === "GET" || method === "HEAD" ? undefined : Readable.toWeb(incoming),
        duplex: method === "GET" || method === "HEAD" ? undefined : "half",
      },
    );

    const response = await handleRequest(request);
    outgoing.writeHead(response.status, Object.fromEntries(response.headers));
    outgoing.end(Buffer.from(await response.arrayBuffer()));
  } catch (error) {
    console.error("Unhandled request error", error);
    outgoing.writeHead(500, { "Content-Type": "application/json", "Cache-Control": "no-store" });
    outgoing.end(JSON.stringify({ ok: false, error: "Internal server error" }));
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Ami Dental appointments service listening on port ${port}`);
});

function shutdown(signal) {
  console.log(`${signal} received, shutting down`);
  server.close((error) => {
    process.exit(error ? 1 : 0);
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
