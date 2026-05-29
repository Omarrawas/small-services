import "dotenv/config";

export const env = {
  isProduction: process.env.NODE_ENV === "production",
  databaseUrl: (process.env.DATABASE_URL ?? "").trim().replace(/^'|'$/g, "").replace(/^"|"$/g, ""),
  ownerUnionId: process.env.OWNER_UNION_ID ?? "",
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID ?? "",
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL ?? "",
    privateKey: (() => {
      let key = (process.env.FIREBASE_PRIVATE_KEY ?? "")
        .trim()
        .replace(/^'|'$/g, "")
        .replace(/^"|"$/g, "")
        .replace(/\\n/g, "\n");
      
      if (key && !key.includes("-----BEGIN PRIVATE KEY-----")) {
        key = `-----BEGIN PRIVATE KEY-----\n${key}\n-----END PRIVATE KEY-----`;
      }
      return key;
    })(),
  },
};


