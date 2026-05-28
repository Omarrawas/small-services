import { Hono } from "hono";
import { handle } from "hono/vercel";

const app = new Hono();

// Health check works even if everything else fails
app.get("/api/health", (c) => c.json({ status: "alive", time: new Date().toISOString() }));

app.all("/api/trpc/*", async (c) => {
  try {
    // Lazy load the big dependencies to catch initialization errors
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
    console.error("[INIT CRASH]", err);
    return c.json({ 
      error: "Initialization Failed", 
      message: err.message,
      stack: err.stack 
    }, 500);
  }
});

// Diagnose helper
app.get("/api/diagnose", async (c) => {
  try {
    const { getDb } = await import("./queries/connection");
    await getDb().execute("SELECT 1");
    return c.json({ db: "CONNECTED" });
  } catch (e: any) {
    return c.json({ db: "FAILED", message: e.message }, 500);
  }
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
export const OPTIONS = handle(app);

export default handle(app);
