import { sql } from "drizzle-orm";
import { getDb } from "../api/queries/connection";
import * as schema from "./schema";

async function seed() {
  const db = getDb();
  console.log("🚀 Seeding database...");

  // 2. Insert Categories
  const categories = [
    { nameAr: "تصميم غرافيك", slug: "graphic-design", icon: "Palette", sortOrder: 1 },
    { nameAr: "برمجة وتطوير", slug: "programming", icon: "Code", sortOrder: 2 },
    { nameAr: "كتابة وترجمة", slug: "writing-translation", icon: "Languages", sortOrder: 3 },
    { nameAr: "تسويق رقمي", slug: "digital-marketing", icon: "Megaphone", sortOrder: 4 },
    { nameAr: "فيديو وأنميشن", slug: "video-animation", icon: "Video", sortOrder: 5 },
    { nameAr: "هندسة وعمارة", slug: "architecture", icon: "Home", sortOrder: 6 },
    { nameAr: "استشارات أعمال", slug: "business-consulting", icon: "Briefcase", sortOrder: 7 },
    { nameAr: "صوتيات وموسيقى", slug: "audio-music", icon: "Music", sortOrder: 8 },
  ];

  console.log("📦 Inserting categories...");
  await db.insert(schema.categories).values(categories).onDuplicateKeyUpdate({
    set: { 
      nameAr: sql`VALUES(name_ar)`, 
      icon: sql`VALUES(icon)`, 
      sortOrder: sql`VALUES(sort_order)` 
    }
  });

  // 3. Create a Demo Seller User if not exists
  console.log("👤 Creating demo users...");
  const demoUsers = [
    { unionId: "demo_user_1", name: "أحمد المحمد", email: "ahmad@demo.com", role: "seller" as const, status: "active" as const, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad" },
    { unionId: "demo_user_2", name: "سارة العلي", email: "sara@demo.com", role: "seller" as const, status: "active" as const, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara" },
  ];

  for (const u of demoUsers) {
    await db.insert(schema.users).values(u).onDuplicateKeyUpdate({ set: { name: u.name } });
  }

  // Get inserted users and categories
  const allUsers = await db.select().from(schema.users);
  const allCats = await db.select().from(schema.categories);

  // 4. Create Seller Profiles
  console.log("📋 Creating seller profiles...");
  for (const user of allUsers) {
    if (user.role === "seller") {
      await db.insert(schema.sellerProfiles).values({
        userId: user.id,
        bio: "مطور ومصمم بخبرة تزيد عن 5 سنوات في العمل الحر.",
        level: "level2",
        rating: "4.9",
        totalOrders: 15,
        completedOrders: 14,
      }).onDuplicateKeyUpdate({ set: { bio: "مطور ومصمم بخبرة تزيد عن 5 سنوات في العمل الحر." } });
    }
  }

  // 5. Create Sample Services
  console.log("🛠️ Creating sample services...");
  const sampleServices = [
    {
      sellerId: allUsers[0].id,
      categoryId: allCats.find((c: any) => c.slug === "graphic-design")?.id || 1,
      title: "تصميم شعار احترافي لشركتك خلال 48 ساعة",
      slug: "professional-logo-design-demo",
      description: "سأقوم بتصميم شعار فريد يعبر عن هوية شركتك بجودة عالية وصيغ متعددة.",
      price: "50000",
      deliveryTime: 2,
      status: "active" as const,
      featured: true,
      images: ["https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=800"],
    },
    {
      sellerId: allUsers[1].id,
      categoryId: allCats.find((c: any) => c.slug === "programming")?.id || 1,
      title: "إنشاء متجر إلكتروني متكامل باستخدام React و Tailwind",
      slug: "react-ecommerce-store-demo",
      description: "بناء متجر سريع الاستجابة مع لوحة تحكم وسلة مشتريات وتصميم عصري.",
      price: "250000",
      deliveryTime: 7,
      status: "active" as const,
      featured: true,
      images: ["https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800"],
    },
  ];

  for (const s of sampleServices) {
    await db.insert(schema.services).values(s).onDuplicateKeyUpdate({ set: { title: s.title, description: s.description } });
  }

  // 6. Ensure Wallets
  console.log("💰 Ensuring wallets...");
  for (const user of allUsers) {
    const balance = user.role === "seller" ? "150000" : "50000";
    await db.insert(schema.wallets).values({
      userId: user.id,
      balance: balance,
    }).onDuplicateKeyUpdate({ set: { balance: balance } });
  }

  console.log("✅ Seeding completed successfully!");
  process.exit(0);
}

seed().catch(err => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
