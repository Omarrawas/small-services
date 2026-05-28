import { Hono } from "hono";
import { handle } from "hono/vercel";

// extremely lightweight app startup
const app = new Hono();

// NO global middlewares for now to avoid any overhead
// Health check: must be lightning fast
app.get("/api/health", (c) => c.json({ status: "ok", time: new Date().toISOString(), ver: "v5-lite" }));

// Diagnose: check basic stuff
app.get("/api/diagnose", async (c) => {
  return c.json({ 
    env: { 
      node: process.version,
      hasDb: !!process.env.DATABASE_URL 
    } 
  });
});

// tRPC: lazy load everything
app.all("/api/trpc/*", async (c) => {
  try {
    const [
      { fetchRequestHandler },
      { appRouter },
      { createContext }
    ] = await Promise.all([
      import("@trpc/server/adapters/fetch"),
      import("./router"),
      import("./context")
    ]);

    return await fetchRequestHandler({
      endpoint: "/api/trpc",
      req: c.req.raw,
      router: appRouter,
      createContext: (opts) => createContext(opts),
    });
  } catch (err: any) {
    console.error("tRPC initialization failed:", err);
    return c.json({ error: "Init Error", message: err.message }, 500);
  }
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
export const OPTIONS = handle(app);

export default handle(app);
