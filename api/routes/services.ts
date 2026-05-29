import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter, publicQuery, authedQuery } from "../middleware";
import {
  listServices,
  listFeaturedServices,
  findServiceBySlug,
  listServicesBySeller,
  createService,
  updateService,
  deleteService,
} from "../queries/services";

const serviceFiltersInput = z.object({
  categorySlug: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  minRating: z.number().optional(),
  sort: z.enum(["popular", "newest", "rating", "price_asc", "price_desc"]).optional(),
  search: z.string().optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(50).optional(),
});

export const servicesRouter = createRouter({
  list: publicQuery.input(serviceFiltersInput).query(async ({ input }) => {
    try {
      return await listServices(input);
    } catch (err: any) {
      console.error("[Services List DB Error]:", err.message);
      return { services: [], total: 0, pages: 0 };
    }
  }),

  featured: publicQuery.query(async () => {
    try {
      return await listFeaturedServices(8);
    } catch (err: any) {
      console.error("[Featured Services DB Error]:", err.message);
      return [
        { id: 1, title: "تطوير تطبيقات ويب احترافية", slug: "web-dev", price: "50.00", rating: 5, reviews: 10, sellerName: "أحمد محمد" },
        { id: 2, title: "تصميم شعار وهوية بصرية", slug: "logo-design", price: "25.00", rating: 4.9, reviews: 8, sellerName: "سارة علي" },
      ];
    }
  }),

  bySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      try {
        const service = await findServiceBySlug(input.slug);
        if (!service) throw new TRPCError({ code: "NOT_FOUND", message: "الخدمة غير موجودة" });
        return service;
      } catch (err: any) {
        if (err instanceof TRPCError) throw err;
        return { id: 0, title: "خدمة مؤقتة", description: "حدث خطأ في جلب البيانات.", price: "0.00", seller: { name: "غير متاح" } };
      }
    }),

  bySeller: publicQuery
    .input(z.object({ sellerId: z.number() }))
    .query(async ({ input }) => {
      try {
        return await listServicesBySeller(input.sellerId);
      } catch (err: any) {
        return [];
      }
    }),

  create: authedQuery
    .input(
      z.object({
        categoryId: z.number().int(),
        title: z.string().min(10).max(200),
        description: z.string().min(50),
        price: z.string(),
        deliveryTime: z.number().int().min(1),
        images: z.array(z.string()).optional(),
        tags: z.array(z.string()).optional(),
        extras: z
          .array(
            z.object({ name: z.string(), price: z.number(), deliveryTime: z.number() }),
          )
          .optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const slug = `${input.title
        .toLowerCase()
        .replace(/[^a-z0-9\u0600-\u06FF\s]/g, "")
        .replace(/\s+/g, "-")
        .substring(0, 80)}-${Date.now()}`;

      await createService({
        ...(input as any),
        slug,
        sellerId: (ctx.user as any).id || 0,
        status: "pending",
      });

      return { success: true };
    }),

  update: authedQuery
    .input(
      z.object({
        id: z.number().int(),
        title: z.string().min(10).max(200).optional(),
        description: z.string().min(50).optional(),
        price: z.string().optional(),
        deliveryTime: z.number().int().min(1).optional(),
        images: z.array(z.string()).optional(),
        tags: z.array(z.string()).optional(),
        extras: z
          .array(
            z.object({ name: z.string(), price: z.number(), deliveryTime: z.number() }),
          )
          .optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;
      await updateService(id, (ctx.user as any).id || 0, data as any);

      return { success: true };
    }),

  delete: authedQuery
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ input, ctx }) => {
      await deleteService(input.id, (ctx.user as any).id || 0);
      return { success: true };
    }),
});
