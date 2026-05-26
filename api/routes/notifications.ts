import { z } from "zod/v4";
import { createRouter, authedQuery } from "../middleware";
import { db } from "../lib/firebase-admin";

export const notificationsRouter = createRouter({
  list: authedQuery.query(async ({ ctx }) => {
    const list = await db.collection("users")
      .doc(ctx.user.unionId)
      .collection("notifications")
      .orderBy("createdAt", "desc")
      .limit(50)
      .get();

    return list.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }),

  markRead: authedQuery
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await db.collection("users")
        .doc(ctx.user.unionId)
        .collection("notifications")
        .doc(input.id)
        .update({ isRead: true });
      return { success: true };
    }),

  markAllRead: authedQuery.mutation(async ({ ctx }) => {
    const batch = db.batch();
    const unread = await db.collection("users")
      .doc(ctx.user.unionId)
      .collection("notifications")
      .where("isRead", "==", false)
      .get();

    unread.docs.forEach(doc => {
      batch.update(doc.ref, { isRead: true });
    });

    await batch.commit();
    return { success: true };
  }),
});
