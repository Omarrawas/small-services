import { eq, and, desc, asc, gte, lte, like, sql, count } from "drizzle-orm";
import { getDb } from "./connection";
import * as schema from "../../db/schema";

export type ServiceFilters = {
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sort?: "popular" | "newest" | "rating" | "price_asc" | "price_desc";
  search?: string;
  page?: number;
  limit?: number;
};

export async function listServices(filters: ServiceFilters = {}) {
  const db = getDb();
  const {
    categorySlug,
    minPrice,
    maxPrice,
    minRating,
    sort = "popular",
    search,
    page = 1,
    limit = 12,
  } = filters;
  const offset = (page - 1) * limit;

  // Build WHERE conditions
  const conditions: ReturnType<typeof eq>[] = [eq(schema.services.status, "active")];

  if (minPrice !== undefined)
    conditions.push(gte(schema.services.price, String(minPrice)));
  if (maxPrice !== undefined)
    conditions.push(lte(schema.services.price, String(maxPrice)));
  if (minRating !== undefined)
    conditions.push(gte(schema.services.rating, String(minRating)));
  if (search)
    conditions.push(like(schema.services.title, `%${search}%`));

  // Handle category filter via join
  const categoryJoin = categorySlug
    ? and(
        eq(schema.categories.id, schema.services.categoryId),
        eq(schema.categories.slug, categorySlug),
      )
    : eq(schema.categories.id, schema.services.categoryId);

  // Order by
  const orderBy =
    sort === "price_asc"
      ? asc(schema.services.price)
      : sort === "price_desc"
        ? desc(schema.services.price)
        : sort === "rating"
          ? desc(schema.services.rating)
          : sort === "newest"
            ? desc(schema.services.createdAt)
            : desc(schema.services.totalOrders); // popular

  const rows = await db
    .select({
      id: schema.services.id,
      sellerId: schema.services.sellerId,
      categoryId: schema.services.categoryId,
      title: schema.services.title,
      slug: schema.services.slug,
      description: schema.services.description,
      price: schema.services.price,
      deliveryTime: schema.services.deliveryTime,
      images: schema.services.images,
      extras: schema.services.extras,
      tags: schema.services.tags,
      status: schema.services.status,
      rating: schema.services.rating,
      totalReviews: schema.services.totalReviews,
      totalOrders: schema.services.totalOrders,
      featured: schema.services.featured,
      createdAt: schema.services.createdAt,
      categoryNameAr: schema.categories.nameAr,
      categorySlug: schema.categories.slug,
    })
    .from(schema.services)
    .innerJoin(schema.categories, categoryJoin)
    .where(and(...conditions))
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset);

  // Total count
  const [countRow] = await db
    .select({ total: count() })
    .from(schema.services)
    .innerJoin(schema.categories, categoryJoin)
    .where(and(...conditions));

  return { rows, total: countRow?.total ?? 0 };
}

export async function listFeaturedServices(limit = 8) {
  return getDb()
    .select({
      id: schema.services.id,
      sellerId: schema.services.sellerId,
      title: schema.services.title,
      slug: schema.services.slug,
      price: schema.services.price,
      deliveryTime: schema.services.deliveryTime,
      images: schema.services.images,
      rating: schema.services.rating,
      totalReviews: schema.services.totalReviews,
      totalOrders: schema.services.totalOrders,
      featured: schema.services.featured,
    })
    .from(schema.services)
    .where(and(eq(schema.services.status, "active"), eq(schema.services.featured, true)))
    .orderBy(desc(schema.services.totalOrders))
    .limit(limit);
}

export async function findServiceBySlug(slug: string) {
  const rows = await getDb()
    .select({
      id: schema.services.id,
      sellerId: schema.services.sellerId,
      categoryId: schema.services.categoryId,
      title: schema.services.title,
      slug: schema.services.slug,
      description: schema.services.description,
      price: schema.services.price,
      deliveryTime: schema.services.deliveryTime,
      images: schema.services.images,
      extras: schema.services.extras,
      tags: schema.services.tags,
      status: schema.services.status,
      rating: schema.services.rating,
      totalReviews: schema.services.totalReviews,
      totalOrders: schema.services.totalOrders,
      featured: schema.services.featured,
      createdAt: schema.services.createdAt,
      categoryNameAr: schema.categories.nameAr,
      categorySlug: schema.categories.slug,
    })
    .from(schema.services)
    .innerJoin(schema.categories, eq(schema.categories.id, schema.services.categoryId))
    .where(eq(schema.services.slug, slug))
    .limit(1);
  return rows.at(0);
}

export async function listServicesBySeller(sellerId: number) {
  return getDb()
    .select()
    .from(schema.services)
    .where(eq(schema.services.sellerId, sellerId))
    .orderBy(desc(schema.services.createdAt));
}

export async function createService(
  data: typeof schema.services.$inferInsert,
) {
  await getDb().insert(schema.services).values(data);
}

export async function updateService(
  id: number,
  sellerId: number,
  data: Partial<typeof schema.services.$inferInsert>,
) {
  await getDb()
    .update(schema.services)
    .set(data)
    .where(and(eq(schema.services.id, id), eq(schema.services.sellerId, sellerId)));
}

export async function deleteService(id: number, sellerId: number) {
  await getDb()
    .delete(schema.services)
    .where(and(eq(schema.services.id, id), eq(schema.services.sellerId, sellerId)));
}

export async function adminUpdateService(
  id: number,
  data: Partial<typeof schema.services.$inferInsert>,
) {
  await getDb()
    .update(schema.services)
    .set(data)
    .where(eq(schema.services.id, id));
}
