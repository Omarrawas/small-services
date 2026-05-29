import { eq, and, desc, count } from "drizzle-orm";
import { nanoid } from "nanoid";
import { getDb } from "./connection";
import * as schema from "../../db/schema";
import { ensureWallet } from "./wallet";

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
  console.log("[Orders] Entering createOrder query function...");
  const db = getDb();
  const orderNumber = generateOrderNumber();

  console.log("[Orders] Starting transaction for:", orderNumber);
  return await db.transaction(async (tx: any) => {
    console.log("[Orders] Inside transaction. Buyer ID:", data.buyerId);
    // 1. Check buyer balance
    const wallet = await ensureWallet(data.buyerId, tx);
    console.log("[Orders] Buyer wallet balance:", wallet.balance);
    const balance = parseFloat(wallet.balance ?? "0");
    const total = parseFloat(data.totalAmount);

    if (balance < total) {
      console.log("[Orders] Insufficient balance. Total:", total, "Balance:", balance);
      throw new Error("رصيدك غير كافٍ لإتمام هذا الطلب. يرجى شحن محفظتك أولاً.");
    }

    // 2. Deduct balance
    const newBalance = (balance - total).toFixed(2);
    console.log("[Orders] Deducting balance. New balance will be:", newBalance);
    await tx.update(schema.wallets)
      .set({ balance: newBalance })
      .where(eq(schema.wallets.id, wallet.id));

    // 3. Create order
    console.log("[Orders] Inserting order record...");
    const [result] = await tx.insert(schema.orders).values({ 
      ...data, 
      orderNumber,
      status: "pending" 
    });
    
    const orderId = result.insertId;
    console.log("[Orders] Order inserted. ID:", orderId);

    // 4. Log transaction
    console.log("[Orders] Recording wallet transaction log...");
    await tx.insert(schema.walletTransactions).values({
      walletId: wallet.id,
      type: "payment",
      amount: data.totalAmount,
      balanceAfter: newBalance,
      referenceType: "order",
      referenceId: orderId,
      description: `شراء خدمة: ${orderNumber}`,
      status: "completed",
    });

    console.log("[Orders] Transaction finished successfully.");
    return { id: orderId, orderNumber };
  });
}

export async function updateOrderStatus(
  id: number,
  userId: number,
  status: typeof schema.orders.$inferInsert.status,
) {
  const db = getDb();
  
  return await db.transaction(async (tx: any) => {
    // 1. Get current order
    const [order] = await tx.select().from(schema.orders).where(eq(schema.orders.id, id)).limit(1);
    if (!order) throw new Error("الطلب غير موجود");

    // 2. Prevent redundant completion or double payment
    if (order.status === "completed" && status === "completed") return;

    // 3. Update status
    await tx.update(schema.orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(schema.orders.id, id));

    // 4. If status is "completed", transfer money to seller
    if (status === "completed") {
      const sellerWallet = await ensureWallet(order.sellerId, tx);
      const currentBalance = parseFloat(sellerWallet.balance ?? "0");
      const amountToAdd = parseFloat(order.totalAmount);
      const newBalance = (currentBalance + amountToAdd).toFixed(2);

      await tx.update(schema.wallets)
        .set({ balance: newBalance })
        .where(eq(schema.wallets.id, sellerWallet.id));

      await tx.insert(schema.walletTransactions).values({
        walletId: sellerWallet.id,
        type: "escrow_release",
        amount: order.totalAmount,
        balanceAfter: newBalance,
        referenceType: "order",
        referenceId: order.id,
        description: `أرباح الطلب: ${order.orderNumber}`,
        status: "completed",
      });
    }
  });
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
