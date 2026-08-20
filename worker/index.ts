import handleContactRequest from "./contact";
import type { Env } from "./env";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    let response: Response;

    if (url.pathname === "/api/hello") {
      response = Response.json({
        message: "Hello from Workers API!",
        timestamp: new Date().toISOString(),
      });
    } else if (url.pathname === "/api/echo" && request.method === "POST") {
      const body = await request.text();
      response = Response.json({ echo: body });
    } else if (url.pathname.startsWith("/api/contact")) {
      // /api/contact → contact.ts に処理を委譲
      response = await handleContactRequest(request, env);
    } else {
      response = new Response("Not Found", { status: 404 });
    }

    // セキュリティヘッダーの付与
    const headers = new Headers(response.headers);
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("X-Frame-Options", "SAMEORIGIN");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
} satisfies ExportedHandler<Env>;
