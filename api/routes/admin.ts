import { z } from "zod";
import { createRouter, adminQuery } from "../middleware";
import {
  getAdminStats,
  listUsers,
  listPendingServices,
  approveService,
  rejectService,
  listAllOrders,
  listWithdrawalRequests,
} from "../queries/admin";
import {
  listPaymentProofs,
  approvePaymentProof,
  updateWithdrawalRequest,
} from "../queries/wallet";

export const adminRouter = createRouter({
  stats: adminQuery.query(async () => {
    return getAdminStats();
  }),

  users: adminQuery.query(async () => {
    return listUsers();
  }),

  services: adminQuery.query(async () => {
    return listPendingServices();
  }),

  approveService: adminQuery
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ input }) => {
      return approveService(input.id);
    }),

  rejectService: adminQuery
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ input }) => {
      return rejectService(input.id);
    }),

  orders: adminQuery.query(async () => {
    return listAllOrders();
  }),

  withdrawals: adminQuery.query(async () => {
    return listWithdrawalRequests();
  }),

  deposits: adminQuery.query(async () => {
    return listPaymentProofs();
  }),

  approveDeposit: adminQuery
    .input(z.object({ id: z.number().int(), userId: z.number().int(), amount: z.string() }))
    .mutation(async ({ input }) => {
      return approvePaymentProof(input.id, input.userId, input.amount);
    }),

  updateWithdrawal: adminQuery
    .input(z.object({ 
      id: z.number().int(), 
      status: z.enum(["approved", "rejected"]),
      adminNote: z.string().optional()
    }))
    .mutation(async ({ input }) => {
      return updateWithdrawalRequest(input.id, input.status, input.adminNote);
    }),
});
