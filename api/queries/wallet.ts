import { eq, desc } from "drizzle-orm";
import { getDb } from "./connection";
import * as schema from "@db/schema";

export async function getWalletByUserId(userId: number) {
  const rows = await getDb()
    .select()
    .from(schema.wallets)
    .where(eq(schema.wallets.userId, userId))
    .limit(1);
  return rows.at(0);
}

export async function ensureWallet(userId: number) {
  const existing = await getWalletByUserId(userId);
  if (existing) return existing;
  await getDb().insert(schema.wallets).values({ userId, balance: "0" });
  return (await getWalletByUserId(userId))!;
}

export async function getWalletTransactions(userId: number, limit = 30) {
  const wallet = await getWalletByUserId(userId);
  if (!wallet) return [];

  return getDb()
    .select()
    .from(schema.walletTransactions)
    .where(eq(schema.walletTransactions.walletId, wallet.id))
    .orderBy(desc(schema.walletTransactions.createdAt))
    .limit(limit);
}

export async function createDepositRequest(
  userId: number,
  amount: string,
  method: typeof schema.paymentProofs.$inferInsert.method,
  transactionNumber?: string,
  senderPhone?: string,
) {
  await getDb().insert(schema.paymentProofs).values({
    userId,
    amount,
    method,
    transactionNumber,
    senderPhone,
    status: "pending",
  });
}

export async function createWithdrawalRequest(
  userId: number,
  amount: string,
  method: typeof schema.withdrawalRequests.$inferInsert.method,
  accountNumber?: string,
  accountName?: string,
) {
  await getDb().insert(schema.withdrawalRequests).values({
    userId,
    amount,
    method,
    accountNumber,
    accountName,
    status: "pending",
  });
}

export async function listWithdrawalRequests(status?: string) {
  const rows = await getDb()
    .select({
      id: schema.withdrawalRequests.id,
      userId: schema.withdrawalRequests.userId,
      amount: schema.withdrawalRequests.amount,
      method: schema.withdrawalRequests.method,
      accountNumber: schema.withdrawalRequests.accountNumber,
      accountName: schema.withdrawalRequests.accountName,
      status: schema.withdrawalRequests.status,
      adminNote: schema.withdrawalRequests.adminNote,
      createdAt: schema.withdrawalRequests.createdAt,
      userName: schema.users.name,
      userAvatar: schema.users.avatar,
    })
    .from(schema.withdrawalRequests)
    .innerJoin(schema.users, eq(schema.users.id, schema.withdrawalRequests.userId))
    .orderBy(desc(schema.withdrawalRequests.createdAt));
  return rows;
}

export async function updateWithdrawalRequest(
  id: number,
  status: "approved" | "rejected",
  adminNote?: string,
) {
  await getDb()
    .update(schema.withdrawalRequests)
    .set({ status, adminNote, processedAt: new Date() })
    .where(eq(schema.withdrawalRequests.id, id));
}

export async function listPaymentProofs() {
  return getDb()
    .select({
      id: schema.paymentProofs.id,
      userId: schema.paymentProofs.userId,
      amount: schema.paymentProofs.amount,
      method: schema.paymentProofs.method,
      transactionNumber: schema.paymentProofs.transactionNumber,
      senderPhone: schema.paymentProofs.senderPhone,
      status: schema.paymentProofs.status,
      adminNote: schema.paymentProofs.adminNote,
      createdAt: schema.paymentProofs.createdAt,
      userName: schema.users.name,
    })
    .from(schema.paymentProofs)
    .innerJoin(schema.users, eq(schema.users.id, schema.paymentProofs.userId))
    .orderBy(desc(schema.paymentProofs.createdAt));
}

export async function approvePaymentProof(id: number, userId: number, amount: string) {
  // Ensure wallet exists
  const wallet = await ensureWallet(userId);

  const newBalance = (parseFloat(wallet.balance ?? "0") + parseFloat(amount)).toFixed(2);

  await getDb()
    .update(schema.wallets)
    .set({ balance: newBalance })
    .where(eq(schema.wallets.userId, userId));

  await getDb().insert(schema.walletTransactions).values({
    walletId: wallet.id,
    type: "deposit",
    amount,
    balanceAfter: newBalance,
    description: "إيداع معتمد من الإدارة",
    status: "completed",
  });

  await getDb()
    .update(schema.paymentProofs)
    .set({ status: "approved", reviewedAt: new Date() })
    .where(eq(schema.paymentProofs.id, id));
}
