import { Hono } from "hono";
import { handle } from "hono/vercel";

const app = new Hono().basePath("/api");

// Health check
app.get("/health", (c) => c.json({ status: "ok", message: "Hono is running on Vercel!", time: new Date().toISOString() }));

// Diagnose
app.get("/diagnose", async (c) => {
  return c.json({ 
    env: { node: process.version, hasDb: !!process.env.DATABASE_URL } 
  });
});

// tRPC lazy loader
app.all("/trpc/*", async (c) => {
  try {
    const [{ fetchRequestHandler }, { appRouter }, { createContext }] = await Promise.all([
      import("@trpc/server/adapters/fetch"),
      import("./router"),
      import("./context")
    ]);

    return fetchRequestHandler({
      endpoint: "/api/trpc",
      req: c.req.raw,
      router: appRouter,
      createContext: (opts) => createContext(opts),
    });
  } catch (err: any) {
    return c.json({ error: "Init Error", message: err.message }, 500);
  }
});

// IMPORTANT: Vercel named exports for Web Standard API
export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
export const OPTIONS = handle(app);
