import { z } from "zod";
import { createRouter, publicQuery, authedQuery } from "../middleware";
import { listReviewsByService, listReviewsBySeller, createReview } from "../queries/reviews";
import { findOrderById } from "../queries/orders";
import { TRPCError } from "@trpc/server";

export const reviewsRouter = createRouter({
  byService: publicQuery
    .input(z.object({ serviceId: z.number().int() }))
    .query(async ({ input }) => {
      return listReviewsByService(input.serviceId);
    }),

  bySeller: publicQuery
    .input(z.object({ sellerId: z.number().int() }))
    .query(async ({ input }) => {
      return listReviewsBySeller(input.sellerId);
    }),


  create: authedQuery
    .input(
      z.object({
        orderId: z.number().int(),
        revieweeId: z.number().int(),
        rating: z.number().int().min(1).max(5),
        comment: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {

      const order = await findOrderById(input.orderId);
      if (!order) throw new TRPCError({ code: "NOT_FOUND", message: "الطلب غير موجود" });
      if (order.status !== "completed")
        throw new TRPCError({ code: "BAD_REQUEST", message: "يجب أن يكون الطلب مكتملاً للتقييم" });

      const isBuyer = order.buyerId === ctx.user.id;
      const isSeller = order.sellerId === ctx.user.id;
      if (!isBuyer && !isSeller)
        throw new TRPCError({ code: "FORBIDDEN", message: "غير مصرح لك بإضافة تقييم" });

      await createReview({
        orderId: input.orderId,
        reviewerId: ctx.user.id,
        revieweeId: input.revieweeId,
        type: isBuyer ? "buyer_to_seller" : "seller_to_buyer",
        rating: input.rating,
        comment: input.comment,
      });
      return { success: true };
    }),
});
