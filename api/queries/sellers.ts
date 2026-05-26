import { eq, desc } from "drizzle-orm";
import { getDb } from "./connection";
import * as schema from "@db/schema";

export async function listTopSellers(limit = 10) {
  return getDb()
    .select({
      id: schema.users.id,
      name: schema.users.name,
      avatar: schema.users.avatar,
      unionId: schema.users.unionId,
      bio: schema.sellerProfiles.bio,
      skills: schema.sellerProfiles.skills,
      level: schema.sellerProfiles.level,
      rating: schema.sellerProfiles.rating,
      totalOrders: schema.sellerProfiles.totalOrders,
      completedOrders: schema.sellerProfiles.completedOrders,
      responseTime: schema.sellerProfiles.responseTime,
      badges: schema.sellerProfiles.badges,
    })
    .from(schema.users)
    .innerJoin(schema.sellerProfiles, eq(schema.sellerProfiles.userId, schema.users.id))
    .where(eq(schema.users.status, "active"))
    .orderBy(desc(schema.sellerProfiles.rating))
    .limit(limit);
}

export async function findSellerById(userId: number) {
  const rows = await getDb()
    .select({
      id: schema.users.id,
      name: schema.users.name,
      avatar: schema.users.avatar,
      unionId: schema.users.unionId,
      email: schema.users.email,
      createdAt: schema.users.createdAt,
      bio: schema.sellerProfiles.bio,
      skills: schema.sellerProfiles.skills,
      level: schema.sellerProfiles.level,
      rating: schema.sellerProfiles.rating,
      totalOrders: schema.sellerProfiles.totalOrders,
      completedOrders: schema.sellerProfiles.completedOrders,
      responseTime: schema.sellerProfiles.responseTime,
      portfolio: schema.sellerProfiles.portfolio,
      badges: schema.sellerProfiles.badges,
    })
    .from(schema.users)
    .innerJoin(schema.sellerProfiles, eq(schema.sellerProfiles.userId, schema.users.id))
    .where(eq(schema.users.id, userId))
    .limit(1);
  return rows.at(0);
}

export async function upsertSellerProfile(
  userId: number,
  data: Partial<typeof schema.sellerProfiles.$inferInsert>,
) {
  const existing = await getDb()
    .select({ id: schema.sellerProfiles.id })
    .from(schema.sellerProfiles)
    .where(eq(schema.sellerProfiles.userId, userId))
    .limit(1);

  if (existing.length > 0) {
    await getDb()
      .update(schema.sellerProfiles)
      .set(data)
      .where(eq(schema.sellerProfiles.userId, userId));
  } else {
    await getDb()
      .insert(schema.sellerProfiles)
      .values({ userId, ...data });
  }
}
