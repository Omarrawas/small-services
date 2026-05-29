import { Hono } from "hono";
import { handle } from "hono/vercel";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";

const app = new Hono().basePath("/api");

// Health check
app.get("/health", (c) => c.json({ status: "ok", message: "Hono is healthy!" }));

// Diagnose
app.get("/diagnose", async (c) => {
  return c.json({ info: "Diagnosis route active" });
});

// TRPC Handler
app.all("/trpc/*", async (c) => {
  try {
    return await fetchRequestHandler({
      endpoint: "/api/trpc",
      req: c.req.raw,
      router: appRouter,
      createContext,
    });
  } catch (err: any) {
    console.error("[TRPC] Error:", err.message);
    return c.json({ error: "Internal Server Error", details: err.message }, 500);
  }
});

// Standalone exports for Vercel Web Standard
export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
export const OPTIONS = handle(app);
