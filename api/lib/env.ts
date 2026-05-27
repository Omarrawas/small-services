import "dotenv/config";

export const env = {
  isProduction: process.env.NODE_ENV === "production",
  databaseUrl: process.env.DATABASE_URL ?? "",
  ownerUnionId: process.env.OWNER_UNION_ID ?? "",
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID ?? "",
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL ?? "",
    privateKey: (process.env.FIREBASE_PRIVATE_KEY ?? "")
      .trim()
      .replace(/^"|"$/g, "")
      .replace(/\\n/g, "\n"),

  },
};

