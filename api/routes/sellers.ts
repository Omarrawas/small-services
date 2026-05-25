import { z } from "zod/v4";
import { createRouter, publicQuery } from "../middleware";
import { listTopSellers, findSellerById } from "../queries/sellers";

export const sellersRouter = createRouter({
  list: publicQuery
    .input(z.object({ limit: z.number().int().min(1).max(20).optional() }).optional())
    .query(async ({ input }) => {
      return listTopSellers(input?.limit ?? 10);
    }),

  profile: publicQuery
    .input(z.object({ id: z.number().int() }))
    .query(async ({ input }) => {
      return findSellerById(input.id);
    }),
});
