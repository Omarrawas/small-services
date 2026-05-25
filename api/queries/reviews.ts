import { eq, and, desc } from "drizzle-orm";
import { getDb } from "./connection";
import * as schema from "@db/schema";

export async function listReviewsByService(serviceId: number) {
  // Get seller of this service first
  const serviceRows = await getDb()
    .select({ sellerId: schema.services.sellerId })
    .from(schema.services)
    .where(eq(schema.services.id, serviceId))
    .limit(1);

  if (!serviceRows.length) return [];
  const sellerId = serviceRows[0].sellerId;

  return getDb()
    .select({
      id: schema.reviews.id,
      rating: schema.reviews.rating,
      comment: schema.reviews.comment,
      createdAt: schema.reviews.createdAt,
      reviewerName: schema.users.name,
      reviewerAvatar: schema.users.avatar,
    })
    .from(schema.reviews)
    .innerJoin(schema.users, eq(schema.users.id, schema.reviews.reviewerId))
    .where(
      and(
        eq(schema.reviews.revieweeId, sellerId),
        eq(schema.reviews.type, "buyer_to_seller"),
      ),
    )
    .orderBy(desc(schema.reviews.createdAt))
    .limit(20);
}

export async function listReviewsBySeller(sellerId: number) {
  return getDb()
    .select({
      id: schema.reviews.id,
      rating: schema.reviews.rating,
      comment: schema.reviews.comment,
      createdAt: schema.reviews.createdAt,
      reviewerName: schema.users.name,
      reviewerAvatar: schema.users.avatar,
    })
    .from(schema.reviews)
    .innerJoin(schema.users, eq(schema.users.id, schema.reviews.reviewerId))
    .where(
      and(
        eq(schema.reviews.revieweeId, sellerId),
        eq(schema.reviews.type, "buyer_to_seller"),
      ),
    )
    .orderBy(desc(schema.reviews.createdAt))
    .limit(20);
}

export async function createReview(data: {
  orderId: number;
  reviewerId: number;
  revieweeId: number;
  type: "buyer_to_seller" | "seller_to_buyer";
  rating: number;
  comment?: string;
}) {
  await getDb().insert(schema.reviews).values(data);
}
