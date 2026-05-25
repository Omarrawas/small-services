import {
  mysqlTable,
  serial,
  varchar,
  text,
  timestamp,
  decimal,
  int,
  json,
  boolean,
  bigint,
  mysqlEnum,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  phone: varchar("phone", { length: 20 }),
  isPhoneVerified: boolean("is_phone_verified").default(false),
  role: mysqlEnum("role", ["buyer", "seller", "admin", "moderator"]).default("buyer").notNull(),
  status: mysqlEnum("status", ["active", "suspended", "banned"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const sellerProfiles = mysqlTable("seller_profiles", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).notNull(),
  bio: text("bio"),
  skills: json("skills").$type<string[]>(),
  level: mysqlEnum("level", ["new", "level1", "level2", "top_rated"]).default("new"),
  totalOrders: int("total_orders").default(0),
  completedOrders: int("completed_orders").default(0),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("0"),
  responseTime: int("response_time"),
  portfolio: json("portfolio").$type<{url: string; title: string}[]>(),
  badges: json("badges").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const categories = mysqlTable("categories", {
  id: serial("id").primaryKey(),
  nameAr: varchar("name_ar", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).unique(),
  icon: varchar("icon", { length: 50 }),
  sortOrder: int("sort_order").default(0),
  isActive: boolean("is_active").default(true),
});

export const services = mysqlTable("services", {
  id: serial("id").primaryKey(),
  sellerId: bigint("seller_id", { mode: "number", unsigned: true }).notNull(),
  categoryId: bigint("category_id", { mode: "number", unsigned: true }).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).unique(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  deliveryTime: int("delivery_time"),
  images: json("images").$type<string[]>(),
  extras: json("extras").$type<{name: string; price: number; deliveryTime: number}[]>(),
  tags: json("tags").$type<string[]>(),
  status: mysqlEnum("status", ["draft", "pending", "active", "paused", "rejected"]).default("pending"),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("0"),
  totalReviews: int("total_reviews").default(0),
  totalOrders: int("total_orders").default(0),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const orders = mysqlTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("order_number", { length: 20 }).unique(),
  buyerId: bigint("buyer_id", { mode: "number", unsigned: true }).notNull(),
  sellerId: bigint("seller_id", { mode: "number", unsigned: true }).notNull(),
  serviceId: bigint("service_id", { mode: "number", unsigned: true }).notNull(),
  extras: json("extras").$type<{name: string; price: number}[]>(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", [
    "pending", "in_progress", "delivered", "revision", "completed", "cancelled", "disputed"
  ]).default("pending"),
  requirements: text("requirements"),
  deliveryDate: timestamp("delivery_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const wallets = mysqlTable("wallets", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).notNull().unique(),
  balance: decimal("balance", { precision: 10, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const walletTransactions = mysqlTable("wallet_transactions", {
  id: serial("id").primaryKey(),
  walletId: bigint("wallet_id", { mode: "number", unsigned: true }).notNull(),
  type: mysqlEnum("type", ["deposit", "withdrawal", "payment", "refund", "escrow_release", "fee"]).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  balanceAfter: decimal("balance_after", { precision: 10, scale: 2 }),
  referenceType: varchar("reference_type", { length: 50 }),
  referenceId: bigint("reference_id", { mode: "number", unsigned: true }),
  description: text("description"),
  status: mysqlEnum("status", ["pending", "completed", "failed", "cancelled"]).default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const withdrawalRequests = mysqlTable("withdrawal_requests", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  method: mysqlEnum("method", ["sham_cash", "syriatel_cash", "mtn_cash", "bank_transfer"]).notNull(),
  accountNumber: varchar("account_number", { length: 100 }),
  accountName: varchar("account_name", { length: 100 }),
  proofImage: text("proof_image"),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending"),
  adminNote: text("admin_note"),
  createdAt: timestamp("created_at").defaultNow(),
  processedAt: timestamp("processed_at"),
});

export const paymentProofs = mysqlTable("payment_proofs", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  method: mysqlEnum("method", ["sham_cash", "syriatel_cash", "mtn_cash"]).notNull(),
  transactionNumber: varchar("transaction_number", { length: 100 }),
  proofImage: text("proof_image"),
  senderPhone: varchar("sender_phone", { length: 20 }),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending"),
  adminNote: text("admin_note"),
  createdAt: timestamp("created_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
});

export const conversations = mysqlTable("conversations", {
  id: serial("id").primaryKey(),
  orderId: bigint("order_id", { mode: "number", unsigned: true }),
  buyerId: bigint("buyer_id", { mode: "number", unsigned: true }).notNull(),
  sellerId: bigint("seller_id", { mode: "number", unsigned: true }).notNull(),
  lastMessage: text("last_message"),
  lastMessageAt: timestamp("last_message_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = mysqlTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: bigint("conversation_id", { mode: "number", unsigned: true }).notNull(),
  senderId: bigint("sender_id", { mode: "number", unsigned: true }).notNull(),
  content: text("content"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reviews = mysqlTable("reviews", {
  id: serial("id").primaryKey(),
  orderId: bigint("order_id", { mode: "number", unsigned: true }).notNull(),
  reviewerId: bigint("reviewer_id", { mode: "number", unsigned: true }).notNull(),
  revieweeId: bigint("reviewee_id", { mode: "number", unsigned: true }).notNull(),
  type: mysqlEnum("type", ["buyer_to_seller", "seller_to_buyer"]).notNull(),
  rating: int("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const disputes = mysqlTable("disputes", {
  id: serial("id").primaryKey(),
  orderId: bigint("order_id", { mode: "number", unsigned: true }).notNull(),
  openedBy: bigint("opened_by", { mode: "number", unsigned: true }).notNull(),
  reason: text("reason"),
  evidence: json("evidence").$type<string[]>(),
  status: mysqlEnum("status", ["open", "under_review", "resolved_buyer", "resolved_seller", "closed"]).default("open"),
  adminDecision: text("admin_decision"),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const notifications = mysqlTable("notifications", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).notNull(),
  type: varchar("type", { length: 50 }),
  title: varchar("title", { length: 200 }),
  body: text("body"),
  data: json("data"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});
