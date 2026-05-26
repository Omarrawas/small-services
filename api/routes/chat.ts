import { z } from "zod/v4";
import { createRouter, authedQuery } from "../middleware";
import { db } from "../lib/firebase-admin";

export const chatRouter = createRouter({
  conversations: authedQuery.query(async ({ ctx }) => {
    const list = await db.collection("conversations")
      .where("participants", "array-contains", ctx.user.unionId)
      .orderBy("lastMessageAt", "desc")
      .get();

    return list.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }),

  messages: authedQuery
    .input(z.object({ conversationId: z.string() }))
    .query(async ({ input }) => {
      const msgs = await db.collection("conversations")
        .doc(input.conversationId)
        .collection("messages")
        .orderBy("createdAt", "desc")
        .limit(50)
        .get();

      return msgs.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    }),

  send: authedQuery
    .input(
      z.object({
        receiverUnionId: z.string(),
        content: z.string().min(1).max(2000),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const participants = [ctx.user.unionId, input.receiverUnionId].sort();
      const convId = participants.join("_");
      
      const convRef = db.collection("conversations").doc(convId);
      const convDoc = await convRef.get();

      if (!convDoc.exists) {
        await convRef.set({
          participants,
          createdAt: new Date(),
          lastMessage: input.content,
          lastMessageAt: new Date(),
        });
      } else {
        await convRef.update({
          lastMessage: input.content,
          lastMessageAt: new Date(),
        });
      }

      await convRef.collection("messages").add({
        senderId: ctx.user.unionId,
        content: input.content,
        createdAt: new Date(),
      });

      return { success: true, conversationId: convId };
    }),
});

