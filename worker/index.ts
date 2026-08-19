import handleContactRequest from "./contact";
import type { Env } from "./env";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/hello") {
      return Response.json({
        message: "Hello from Workers API!",
        timestamp: new Date().toISOString(),
      });
    }

    if (url.pathname === "/api/echo" && request.method === "POST") {
      const body = await request.text();
      return Response.json({ echo: body });
    }

    // /api/contact → contact.ts に処理を委譲
    if (url.pathname.startsWith("/api/contact")) {
      return handleContactRequest(request, env);
    }

    return new Response("Not Found", { status: 404 });
  },
} satisfies ExportedHandler<Env>;
