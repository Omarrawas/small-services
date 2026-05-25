import { eq, and, desc, or } from "drizzle-orm";
import { getDb } from "./connection";
import * as schema from "@db/schema";

export async function listConversations(userId: number) {
  return getDb()
    .select({
      id: schema.conversations.id,
      orderId: schema.conversations.orderId,
      buyerId: schema.conversations.buyerId,
      sellerId: schema.conversations.sellerId,
      lastMessage: schema.conversations.lastMessage,
      lastMessageAt: schema.conversations.lastMessageAt,
      createdAt: schema.conversations.createdAt,
      otherName: schema.users.name,
      otherAvatar: schema.users.avatar,
    })
    .from(schema.conversations)
    .innerJoin(
      schema.users,
      // Join to the OTHER participant
      and(
        or(
          eq(schema.conversations.buyerId, userId),
          eq(schema.conversations.sellerId, userId),
        ),
        or(
          and(
            eq(schema.conversations.buyerId, userId),
            eq(schema.users.id, schema.conversations.sellerId),
          ),
          and(
            eq(schema.conversations.sellerId, userId),
            eq(schema.users.id, schema.conversations.buyerId),
          ),
        ),
      ),
    )
    .where(
      or(
        eq(schema.conversations.buyerId, userId),
        eq(schema.conversations.sellerId, userId),
      ),
    )
    .orderBy(desc(schema.conversations.lastMessageAt));
}

export async function findConversation(id: number) {
  const rows = await getDb()
    .select()
    .from(schema.conversations)
    .where(eq(schema.conversations.id, id))
    .limit(1);
  return rows.at(0);
}

export async function findOrCreateConversation(buyerId: number, sellerId: number, orderId?: number) {
  const existing = await getDb()
    .select()
    .from(schema.conversations)
    .where(
      and(
        eq(schema.conversations.buyerId, buyerId),
        eq(schema.conversations.sellerId, sellerId),
      ),
    )
    .limit(1);

  if (existing.length > 0) return existing[0];

  await getDb().insert(schema.conversations).values({
    buyerId,
    sellerId,
    orderId,
  });

  const created = await getDb()
    .select()
    .from(schema.conversations)
    .where(
      and(
        eq(schema.conversations.buyerId, buyerId),
        eq(schema.conversations.sellerId, sellerId),
      ),
    )
    .limit(1);
  return created.at(0)!;
}

export async function listMessages(conversationId: number, limit = 50) {
  return getDb()
    .select({
      id: schema.messages.id,
      content: schema.messages.content,
      isRead: schema.messages.isRead,
      createdAt: schema.messages.createdAt,
      senderId: schema.messages.senderId,
      senderName: schema.users.name,
      senderAvatar: schema.users.avatar,
    })
    .from(schema.messages)
    .innerJoin(schema.users, eq(schema.users.id, schema.messages.senderId))
    .where(eq(schema.messages.conversationId, conversationId))
    .orderBy(desc(schema.messages.createdAt))
    .limit(limit);
}

export async function sendMessage(data: {
  conversationId: number;
  senderId: number;
  content: string;
}) {
  await getDb().insert(schema.messages).values(data);
  await getDb()
    .update(schema.conversations)
    .set({
      lastMessage: data.content.substring(0, 100),
      lastMessageAt: new Date(),
    })
    .where(eq(schema.conversations.id, data.conversationId));
}

export async function markMessagesRead(conversationId: number, userId: number) {
  await getDb()
    .update(schema.messages)
    .set({ isRead: true })
    .where(
      and(
        eq(schema.messages.conversationId, conversationId),
        eq(schema.messages.isRead, false),
      ),
    );
}
