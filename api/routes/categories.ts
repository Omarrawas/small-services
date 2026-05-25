import { createRouter, publicQuery } from "../middleware";
import { listCategories, findCategoryBySlug } from "../queries/categories";
import { z } from "zod/v4";

export const categoriesRouter = createRouter({
  list: publicQuery.query(async () => {
    return listCategories();
  }),

  bySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      return findCategoryBySlug(input.slug);
    }),
});
