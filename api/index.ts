import { Hono } from "hono";
import { handle } from "hono/vercel";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { initTRPC } from "@trpc/server";

// 1. Minimalistic Mock Logic
const t = initTRPC.create();
const appRouter = t.router({
  auth: t.router({
    me: t.procedure.query(() => ({
      unionId: "mock-uid",
      name: "User via Mock Mode",
      email: "test@example.com",
      role: "admin"
    }))
  })
});

const app = new Hono().basePath("/api");

// Health check
app.get("/health", (c) => c.json({ status: "ok", message: "MOCK MODE ACTIVE" }));

// TRPC Handler
app.all("/trpc/*", async (c) => {
  return await fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext: () => ({}),
  });
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
export const OPTIONS = handle(app);
