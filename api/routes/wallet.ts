import { z } from "zod/v4";
import { createRouter, authedQuery } from "../middleware";
import {
  getWalletByUserId,
  ensureWallet,
  getWalletTransactions,
  createDepositRequest,
  createWithdrawalRequest,
} from "../queries/wallet";

export const walletRouter = createRouter({
  balance: authedQuery.query(async ({ ctx }) => {
    const wallet = await ensureWallet(ctx.user.id);
    return { balance: wallet.balance ?? "0" };
  }),

  transactions: authedQuery
    .input(z.object({ limit: z.number().int().min(1).max(100).optional() }).optional())
    .query(async ({ input, ctx }) => {
      return getWalletTransactions(ctx.user.id, input?.limit ?? 30);
    }),

  deposit: authedQuery
    .input(
      z.object({
        amount: z.string().min(1),
        method: z.enum(["sham_cash", "syriatel_cash", "mtn_cash"]),
        transactionNumber: z.string().optional(),
        senderPhone: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await createDepositRequest(
        ctx.user.id,
        input.amount,
        input.method,
        input.transactionNumber,
        input.senderPhone,
      );
      return { success: true };
    }),

  withdraw: authedQuery
    .input(
      z.object({
        amount: z.string().min(1),
        method: z.enum(["sham_cash", "syriatel_cash", "mtn_cash", "bank_transfer"]),
        accountNumber: z.string().optional(),
        accountName: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const wallet = await getWalletByUserId(ctx.user.id);
      const balance = parseFloat(wallet?.balance ?? "0");
      const amount = parseFloat(input.amount);

      if (balance < amount) {
        throw new Error("رصيدك غير كافٍ لإتمام عملية السحب");
      }

      await createWithdrawalRequest(
        ctx.user.id,
        input.amount,
        input.method,
        input.accountNumber,
        input.accountName,
      );
      return { success: true };
    }),
});
