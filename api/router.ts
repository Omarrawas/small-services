import { authRouter } from "./auth-router";
import { createRouter, publicQuery } from "./middleware";
// We temporarily disable these to isolate the 500 error cause
// import { categoriesRouter } from "./routes/categories";
// import { servicesRouter } from "./routes/services";
// import { sellersRouter } from "./routes/sellers";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  // Mock implementations for the ones we disabled to keep types happy in frontend if needed
  categories: createRouter({
    list: publicQuery.query(() => ([])),
  }),
  services: createRouter({
    featured: publicQuery.query(() => ([])),
    list: publicQuery.query(() => ({ services: [], total: 0, pages: 0 })),
  }),
  sellers: createRouter({
    list: publicQuery.query(() => ([])),
  }),
  // Other routers can stay for now as empty objects if they don't load huge things
  orders: createRouter({}),
  wallet: createRouter({}),
  reviews: createRouter({}),
  chat: createRouter({}),
  admin: createRouter({}),
  notifications: createRouter({}),
});

export type AppRouter = typeof appRouter;
