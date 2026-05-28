import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import type { HttpBindings } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";
import { env } from "./lib/env";

const app = new Hono<{ Bindings: HttpBindings }>();

app.use("*", async (c, next) => {
  console.log(`[v2] Request: ${c.req.method} ${c.req.url}`);
  c.res.headers.set("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  await next();
});

app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));
app.onError((err, c) => {
  console.error("[CRITICAL HONO ERROR]", err);
  return c.json({ 
    error: "Server Error", 
    message: err.message,
    ...(process.env.NODE_ENV === "development" ? { stack: err.stack } : {})
  }, 500);
});


app.get("/api/debug", (c) => c.json({ ok: true, env: { hasDb: !!env.databaseUrl, hasFirebase: !!env.firebase.projectId } }));

app.all("/api/trpc/*", async (c) => {
  try {
    return await fetchRequestHandler({
      endpoint: "/api/trpc",
      req: c.req.raw,
      router: appRouter,
      createContext,
    });
  } catch (err: any) {
    console.error("[tRPC Handler Error]", err);
    return c.json({ 
      error: "Internal Protocol Error", 
      message: err.message,
      details: typeof err === 'object' ? JSON.stringify(err) : String(err)
    }, 500);
  }
});


app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

export default app;


if (env.isProduction && !process.env.VERCEL) {
  const { serve } = await import("@hono/node-server");
  const { serveStaticFiles } = await import("./lib/vite");
  serveStaticFiles(app);

  const port = parseInt(process.env.PORT || "3000");
  serve({ fetch: app.fetch, port }, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
