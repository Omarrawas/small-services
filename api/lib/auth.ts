import { auth as adminAuth } from "./firebase-admin";
import { upsertUser } from "../queries/users";

export interface AuthedUser {
  id?: number;
  unionId: string;
  name?: string;
  email?: string;
  avatar?: string;
  role: "buyer" | "seller" | "admin" | "moderator";
}

// Update this list with emails that should have admin access
const ADMIN_EMAILS = [
  "omar.rawas17@gmail.com",
  "lizasister6@gmail.com", // Keeping previous one just in case
];

export async function authenticateRequest(req: Request): Promise<AuthedUser | null> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const idToken = authHeader.split("Bearer ")[1];
  
  try {
    if (!adminAuth) return null;

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const email = decodedToken.email;
    const isAdmin = email && ADMIN_EMAILS.includes(email);
    
    // Try to sync with DB, but don't crash if DB fails
    try {
      const user = await upsertUser({
        unionId: decodedToken.uid,
        email: email,
        name: decodedToken.name || email?.split("@")[0] || "User",
        avatar: decodedToken.picture,
        role: isAdmin ? "admin" : "buyer", // Set admin role if in list
        lastSignInAt: new Date(),
      });
      return user;
    } catch (dbErr: any) {
      console.warn("[Auth] DB Sync failed, using Firebase fallback:", dbErr.message);
      return {
        unionId: decodedToken.uid,
        email: email,
        name: decodedToken.name || "User",
        role: isAdmin ? "admin" : "buyer",
      };
    }

  } catch (error: any) {
    console.error("[Auth] Token verification failed:", error.message);
    return null;
  }
}
