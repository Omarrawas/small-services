import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";
import { createRouter, authedQuery } from "../middleware";
import {
  listOrdersByUser,
  findOrderById,
  createOrder,
  updateOrderStatus,
} from "../queries/orders";
import { findServiceBySlug } from "../queries/services";

export const ordersRouter = createRouter({
  list: authedQuery
    .input(z.object({ role: z.enum(["buyer", "seller"]).optional() }).optional())
    .query(async ({ input, ctx }) => {
      return listOrdersByUser(ctx.user.id, input?.role ?? "buyer");
    }),

  byId: authedQuery
    .input(z.object({ id: z.number().int() }))
    .query(async ({ input, ctx }) => {
      const order = await findOrderById(input.id);
      if (!order) throw new TRPCError({ code: "NOT_FOUND", message: "الطلب غير موجود" });
      if (order.buyerId !== ctx.user.id && order.sellerId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "غير مصرح لك بعرض هذا الطلب" });
      }
      return order;
    }),

  create: authedQuery
    .input(
      z.object({
        serviceSlug: z.string(),
        extras: z.array(z.object({ name: z.string(), price: z.number() })).optional(),
        requirements: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const service = await findServiceBySlug(input.serviceSlug);
      if (!service)
        throw new TRPCError({ code: "NOT_FOUND", message: "الخدمة غير موجودة" });
      if (service.status !== "active")
        throw new TRPCError({ code: "BAD_REQUEST", message: "الخدمة غير متاحة للطلب" });
      if (service.sellerId === ctx.user.id)
        throw new TRPCError({ code: "BAD_REQUEST", message: "لا يمكنك طلب خدمتك الخاصة" });

      const extrasTotal = input.extras?.reduce((sum, e) => sum + e.price, 0) ?? 0;
      const totalAmount = (parseFloat(service.price) + extrasTotal).toFixed(2);
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + (service.deliveryTime ?? 3));

      await createOrder({
        buyerId: ctx.user.id,
        sellerId: service.sellerId,
        serviceId: service.id,
        extras: input.extras,
        totalAmount,
        requirements: input.requirements,
        deliveryDate,
      });

      return { success: true };
    }),

  updateStatus: authedQuery
    .input(
      z.object({
        id: z.number().int(),
        status: z.enum(["in_progress", "delivered", "revision", "completed", "cancelled"]),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const order = await findOrderById(input.id);
      if (!order) throw new TRPCError({ code: "NOT_FOUND", message: "الطلب غير موجود" });
      if (order.buyerId !== ctx.user.id && order.sellerId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "غير مصرح لك بتعديل هذا الطلب" });
      }
      await updateOrderStatus(input.id, ctx.user.id, input.status);
      return { success: true };
    }),
});
