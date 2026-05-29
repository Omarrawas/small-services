import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { listTopSellers, findSellerById } from "../queries/sellers";

export const sellersRouter = createRouter({
  list: publicQuery
    .input(z.object({ limit: z.number().int().min(1).max(20).optional() }).optional())
    .query(async ({ input }) => {
      try {
        return await listTopSellers(input?.limit ?? 10);
      } catch (err: any) {
        console.error("[Sellers List DB Error]:", err.message);
        // Fallback mock data
        return [
          { id: 1, name: "مورد تجريبي 1", avatar: "", rating: 4.8, completedOrders: 15 },
          { id: 2, name: "مورد تجريبي 2", avatar: "", rating: 4.5, completedOrders: 10 },
        ];
      }
    }),

  profile: publicQuery
    .input(z.object({ id: z.number().int() }))
    .query(async ({ input }) => {
      try {
        return await findSellerById(input.id);
      } catch (err: any) {
        console.error("[Seller Profile DB Error]:", err.message);
        return { id: input.id, name: "مورد غير متاح حالياً", avatar: "", bio: "حدث خطأ في الاتصال بقاعدة البيانات." };
      }
    }),
});
