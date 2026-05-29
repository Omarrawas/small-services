import { auth as adminAuth } from "./firebase-admin";

export interface AuthedUser {
  unionId: string;
  name?: string;
  email?: string;
  avatar?: string;
  role: "buyer" | "seller" | "admin" | "moderator";
}

export async function authenticateRequest(req: Request): Promise<AuthedUser | null> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const idToken = authHeader.split("Bearer ")[1];
  
  try {
    if (!adminAuth) {
      console.warn("[Auth] Firebase Admin not initialized, returning null");
      return null;
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    // TEMPORARY: Return user info directly from Firebase Token 
    // to bypass the current Database import crash on Vercel.
    return {
      unionId: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name || decodedToken.email?.split("@")[0] || "User",
      avatar: decodedToken.picture,
      role: "admin", // Hardcoded as admin for owner testing
    };

  } catch (error: any) {
    console.error("[Auth] Token verification failed:", error.message);
    return null;
  }
}
