import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { authenticateRequest } from "./lib/auth";

export type TrpcContext = {
  req: Request;
  resHeaders: Headers;
  user?: any;
};

export async function createContext(
  opts: FetchCreateContextFnOptions,
): Promise<TrpcContext> {
  const ctx: TrpcContext = { req: opts.req, resHeaders: opts.resHeaders };
  try {
    // Pass the raw request to authenticateRequest
    ctx.user = await authenticateRequest(opts.req);
  } catch (err: any) {
    console.error("[Context Creation Error]:", err.message);
    // Authentication is optional here
  }
  return ctx;
}
