import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";
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
    return listServices(input);
  }),

  featured: publicQuery.query(async () => {
    return listFeaturedServices(8);
  }),

  bySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const service = await findServiceBySlug(input.slug);
      if (!service) throw new TRPCError({ code: "NOT_FOUND", message: "الخدمة غير موجودة" });
      return service;
    }),

  bySeller: publicQuery
    .input(z.object({ sellerId: z.number() }))
    .query(async ({ input }) => {
      return listServicesBySeller(input.sellerId);
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
        ...input,
        slug,
        sellerId: ctx.user.id,
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
      await updateService(id, ctx.user.id, data);
      return { success: true };
    }),

  delete: authedQuery
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ input, ctx }) => {
      await deleteService(input.id, ctx.user.id);
      return { success: true };
    }),
});
