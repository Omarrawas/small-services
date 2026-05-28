import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";
import { env } from "./lib/env";
import type { HttpBindings } from "@hono/node-server";
import { handle } from "hono/vercel";

console.log("[v2] Booting API...");
console.log("[v2] DB_URL Status:", !!process.env.DATABASE_URL ? "DETECTED" : "NULL");

const app = new Hono<{ Bindings: HttpBindings }>();

app.use("*", async (c, next) => {
  console.log(`[v2] Request: ${c.req.method} ${c.req.url}`);
  // Add COOP header to response as well, just in case
  c.res.headers.set("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  await next();
});

app.onError((err, c) => {
  console.error("[CRITICAL HONO ERROR]", err);
  return c.json({ 
    error: "Server Error", 
    message: err.message,
    ...(process.env.NODE_ENV === "development" ? { stack: err.stack } : {})
  }, 500);
});


app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));

// Simple health check first
app.get("/api/health", (c) => c.json({ status: "ok", time: new Date().toISOString() }));

try {
  app.all("/api/trpc/*", async (c) => {
    try {
      return await fetchRequestHandler({
        endpoint: "/api/trpc",
        req: c.req.raw,
        router: appRouter,
        createContext: (opts) => createContext({ ...opts }),
        onError: ({ error, path }) => {
          console.error(`[tRPC Error] path: ${path}`, error);
        },
      });
    } catch (e: any) {
      console.error("[tRPC Fetch Handler Crash]", e);
      return c.json({ 
        error: "Internal Protocol Error", 
        message: e.message,
        details: typeof e === 'object' ? JSON.stringify(e) : String(e)
      }, 500);
    }
  });

  app.all("/api/*", (c) => c.json({ error: "Route Not Found" }, 404));
} catch (e) {
  console.error("Failed to initialize API routes:", e);
}


export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
export const OPTIONS = handle(app);

export default handle(app);

if (env.isProduction && !process.env.VERCEL) {
  const { serve } = await import("@hono/node-server");
  const { serveStaticFiles } = await import("./lib/vite");
  serveStaticFiles(app);
  const port = parseInt(process.env.PORT || "3000");
  serve({ fetch: app.fetch, port }, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}


