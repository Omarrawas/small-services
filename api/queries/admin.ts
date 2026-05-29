import { desc, count, sql, eq } from "drizzle-orm";
import { getDb } from "./connection";
import * as schema from "../../db/schema"; // Corrected import path

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
      ? Math.round(((completionRow?.completed ?? 0) / (completionRow.total ?? 1)) * 100)
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

export async function listUsers(limit = 50) {
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

export async function listPendingServices() {
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

export async function approveService(id: number) {
  await getDb()
    .update(schema.services)
    .set({ status: "active" })
    .where(eq(schema.services.id, id));
}

export async function rejectService(id: number) {
  await getDb()
    .update(schema.services)
    .set({ status: "rejected" })
    .where(eq(schema.services.id, id));
}

export async function listAllOrders(limit = 50) {
  return getDb()
    .select({
      id: schema.orders.id,
      orderNumber: schema.orders.orderNumber,
      totalAmount: schema.orders.totalAmount,
      status: schema.orders.status,
      createdAt: schema.orders.createdAt,
      serviceTitle: schema.services.title,
      buyerName: schema.users.name,
    })
    .from(schema.orders)
    .innerJoin(schema.services, eq(schema.services.id, schema.orders.serviceId))
    .innerJoin(schema.users, eq(schema.users.id, schema.orders.buyerId))
    .orderBy(desc(schema.orders.createdAt))
    .limit(limit);
}

export async function listWithdrawalRequests() {
  return getDb()
    .select({
      id: schema.withdrawalRequests.id,
      userId: schema.withdrawalRequests.userId,
      amount: schema.withdrawalRequests.amount,
      method: schema.withdrawalRequests.method,
      accountNumber: schema.withdrawalRequests.accountNumber,
      accountName: schema.withdrawalRequests.accountName,
      status: schema.withdrawalRequests.status,
      createdAt: schema.withdrawalRequests.createdAt,
      userName: schema.users.name,
      userAvatar: schema.users.avatar,
    })
    .from(schema.withdrawalRequests)
    .innerJoin(schema.users, eq(schema.users.id, schema.withdrawalRequests.userId))
    .orderBy(desc(schema.withdrawalRequests.createdAt));
}
