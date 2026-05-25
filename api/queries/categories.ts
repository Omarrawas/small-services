import { eq, and, sql } from "drizzle-orm";
import { getDb } from "./connection";
import * as schema from "@db/schema";

export async function listCategories() {
  const rows = await getDb()
    .select({
      id: schema.categories.id,
      nameAr: schema.categories.nameAr,
      slug: schema.categories.slug,
      icon: schema.categories.icon,
      sortOrder: schema.categories.sortOrder,
      serviceCount: sql<number>`count(${schema.services.id})`,
    })
    .from(schema.categories)
    .leftJoin(
      schema.services,
      and(
        eq(schema.services.categoryId, schema.categories.id),
        eq(schema.services.status, "active"),
      ),
    )
    .where(eq(schema.categories.isActive, true))
    .groupBy(schema.categories.id)
    .orderBy(schema.categories.sortOrder);

  return rows;
}

export async function findCategoryBySlug(slug: string) {
  const rows = await getDb()
    .select()
    .from(schema.categories)
    .where(eq(schema.categories.slug, slug))
    .limit(1);
  return rows.at(0);
}
