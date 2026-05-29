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

    // RETURN FIREBASE USER DIRECTLY - Avoid DB sync for now to prevent Vercel crashes
    return {
      id: decodedToken.uid, // Use UID as string ID
      unionId: decodedToken.uid,
      email: email,
      name: decodedToken.name || email?.split("@")[0] || "User",
      avatar: decodedToken.picture,
      role: isAdmin ? "admin" : "buyer",
    };

  } catch (error: any) {
    console.error("[Auth] Token verification failed:", error.message);
    return null;
  }
}
