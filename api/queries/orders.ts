import { eq, and, desc, count } from "drizzle-orm";
import { nanoid } from "nanoid";
import { getDb } from "./connection";
import * as schema from "../../db/schema";

function generateOrderNumber() {
  return `ORD-${new Date().getFullYear()}-${nanoid(6).toUpperCase()}`;
}

export async function listOrdersByUser(userId: number, role: "buyer" | "seller") {
  const condition =
    role === "buyer"
      ? eq(schema.orders.buyerId, userId)
      : eq(schema.orders.sellerId, userId);

  return getDb()
    .select({
      id: schema.orders.id,
      orderNumber: schema.orders.orderNumber,
      totalAmount: schema.orders.totalAmount,
      status: schema.orders.status,
      requirements: schema.orders.requirements,
      deliveryDate: schema.orders.deliveryDate,
      createdAt: schema.orders.createdAt,
      updatedAt: schema.orders.updatedAt,
      serviceTitle: schema.services.title,
      serviceSlug: schema.services.slug,
      buyerName: schema.users.name,
    })
    .from(schema.orders)
    .innerJoin(schema.services, eq(schema.services.id, schema.orders.serviceId))
    .innerJoin(schema.users, eq(schema.users.id, schema.orders.buyerId))
    .where(condition)
    .orderBy(desc(schema.orders.createdAt));
}

export async function findOrderById(id: number) {
  const rows = await getDb()
    .select({
      id: schema.orders.id,
      orderNumber: schema.orders.orderNumber,
      buyerId: schema.orders.buyerId,
      sellerId: schema.orders.sellerId,
      serviceId: schema.orders.serviceId,
      extras: schema.orders.extras,
      totalAmount: schema.orders.totalAmount,
      status: schema.orders.status,
      requirements: schema.orders.requirements,
      deliveryDate: schema.orders.deliveryDate,
      createdAt: schema.orders.createdAt,
      updatedAt: schema.orders.updatedAt,
      serviceTitle: schema.services.title,
      serviceSlug: schema.services.slug,
    })
    .from(schema.orders)
    .innerJoin(schema.services, eq(schema.services.id, schema.orders.serviceId))
    .where(eq(schema.orders.id, id))
    .limit(1);
  return rows.at(0);
}

export async function createOrder(data: {
  buyerId: number;
  sellerId: number;
  serviceId: number;
  extras?: { name: string; price: number }[];
  totalAmount: string;
  requirements?: string;
  deliveryDate?: Date;
}) {
  const orderNumber = generateOrderNumber();
  await getDb().insert(schema.orders).values({ ...data, orderNumber });
}

export async function updateOrderStatus(
  id: number,
  userId: number,
  status: typeof schema.orders.$inferInsert.status,
) {
  await getDb()
    .update(schema.orders)
    .set({ status, updatedAt: new Date() })
    .where(
      and(
        eq(schema.orders.id, id),
        // Either buyer or seller can update
      ),
    );
}

export async function adminListOrders(limit = 50) {
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

export async function countOrders() {
  const [row] = await getDb().select({ total: count() }).from(schema.orders);
  return row?.total ?? 0;
}
