import { desc, count, sql, eq } from "drizzle-orm";
import { getDb } from "./connection";
import * as schema from "@db/schema";

export async function getAdminStats() {
  const db = getDb();

  const [usersCount] = await db.select({ total: count() }).from(schema.users);
  const [servicesCount] = await db.select({ total: count() }).from(schema.services);
  const [ordersCount] = await db.select({ total: count() }).from(schema.orders);
  const [disputesCount] = await db
    .select({ total: count() })
    .from(schema.disputes)
    .where(eq(schema.disputes.status, "open"));

  const [completionRow] = await db
    .select({
      completed: sql<number>`sum(case when status = 'completed' then 1 else 0 end)`,
      total: count(),
    })
    .from(schema.orders);

  const completionRate =
    completionRow?.total > 0
      ? Math.round(((completionRow?.completed ?? 0) / completionRow.total) * 100)
      : 0;

  const [walletRow] = await db
    .select({
      total: sql<number>`sum(cast(balance as decimal(10,2)))`,
    })
    .from(schema.wallets);

  return {
    users: usersCount?.total ?? 0,
    services: servicesCount?.total ?? 0,
    orders: ordersCount?.total ?? 0,
    disputes: disputesCount?.total ?? 0,
    completionRate,
    totalWalletBalance: walletRow?.total ?? 0,
  };
}

export async function adminListUsers(limit = 50) {
  return getDb()
    .select({
      id: schema.users.id,
      name: schema.users.name,
      email: schema.users.email,
      avatar: schema.users.avatar,
      role: schema.users.role,
      status: schema.users.status,
      createdAt: schema.users.createdAt,
      lastSignInAt: schema.users.lastSignInAt,
    })
    .from(schema.users)
    .orderBy(desc(schema.users.createdAt))
    .limit(limit);
}

export async function adminListPendingServices() {
  return getDb()
    .select({
      id: schema.services.id,
      title: schema.services.title,
      price: schema.services.price,
      status: schema.services.status,
      createdAt: schema.services.createdAt,
      sellerName: schema.users.name,
      categoryName: schema.categories.nameAr,
    })
    .from(schema.services)
    .innerJoin(schema.users, eq(schema.users.id, schema.services.sellerId))
    .innerJoin(schema.categories, eq(schema.categories.id, schema.services.categoryId))
    .where(eq(schema.services.status, "pending"))
    .orderBy(desc(schema.services.createdAt));
}

export async function adminUpdateUserStatus(
  id: number,
  status: typeof schema.users.$inferInsert.status,
) {
  await getDb()
    .update(schema.users)
    .set({ status })
    .where(eq(schema.users.id, id));
}

export async function adminUpdateUserRole(
  id: number,
  role: typeof schema.users.$inferInsert.role,
) {
  await getDb()
    .update(schema.users)
    .set({ role })
    .where(eq(schema.users.id, id));
}
