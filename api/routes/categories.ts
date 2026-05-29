import { createRouter, publicQuery } from "../middleware";
import { listCategories, findCategoryBySlug } from "../queries/categories";
import { z } from "zod";

export const categoriesRouter = createRouter({
  list: publicQuery.query(async () => {
    try {
      return await listCategories();
    } catch (err: any) {
      console.error("[Categories DB Error]:", err.message);
      return [
        { id: 1, name: "برمجة وتطوير", slug: "dev", icon: "code" },
        { id: 2, name: "تصميم جرافيك", slug: "design", icon: "palette" },
        { id: 3, name: "تسويق إلكتروني", slug: "marketing", icon: "trending-up" },
      ];
    }
  }),

  bySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      try {
        return await findCategoryBySlug(input.slug);
      } catch (err: any) {
        return { id: 0, name: "تصنيف مؤقت", slug: input.slug, description: "البيانات غير متاحة حالياً." };
      }
    }),
});
