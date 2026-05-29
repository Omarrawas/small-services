import { auth as adminAuth } from "./firebase-admin";

export interface AuthedUser {
  id?: string;
  unionId: string;
  name?: string;
  email?: string;
  avatar?: string;
  role: "buyer" | "seller" | "admin" | "moderator";
}

const ADMIN_EMAILS = [
  "omar.rawas17@gmail.com",
];

export async function authenticateRequest(req: Request): Promise<AuthedUser | null> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const idToken = authHeader.split("Bearer ")[1];

  try {
    if (!adminAuth) {
      console.error("[Auth] Firebase Admin not initialized");
      return null;
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const email = decodedToken.email;
    const isAdmin = email && ADMIN_EMAILS.includes(email);

    // Sync with DB to get/create numeric ID
    console.log("[Auth] Syncing user with DB. UID:", decodedToken.uid);
    const { upsertUser } = await import("../queries/users");
    const dbUser = await upsertUser({
      unionId: decodedToken.uid,
      email: email,
      name: decodedToken.name || email?.split("@")[0] || "User",
      avatar: decodedToken.picture,
      role: isAdmin ? "admin" : "buyer",
    });
    console.log("[Auth] DB Sync completed. DB ID:", dbUser?.id);

    if (!dbUser) {
       console.error("[Auth] DB Sync failed for UID:", decodedToken.uid);
       return null;
    }

    return {
      id: dbUser.id as any, // Numeric ID from DB
      unionId: dbUser.unionId,
      email: dbUser.email ?? undefined,
      name: dbUser.name ?? undefined,
      avatar: dbUser.avatar ?? undefined,
      role: dbUser.role as any,
    };

  } catch (error: any) {
    console.error("[Auth] Token verification failed:", error.message);
    return null;
  }
}
