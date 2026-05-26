import { auth } from "./firebase-admin";
import { findUserByUnionId } from "../queries/users";
import { Errors } from "@contracts/errors";

export async function authenticateRequest(headers: Headers) {
  const authHeader = headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw Errors.forbidden("Missing or invalid authorization header");
  }

  const idToken = authHeader.split("Bearer ")[1];
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;
    
    let user = await findUserByUnionId(uid);
    if (!user) {
      const fbUser = await auth.getUser(uid);
      const { upsertUser } = await import("../queries/users");
      user = await upsertUser({
        unionId: uid,
        name: fbUser.displayName || "Anonymous",
        email: fbUser.email,
        avatar: fbUser.photoURL,
        lastSignInAt: new Date(),
      });
    }
    return user;

  } catch (error) {
    console.error("[Auth] Token verification failed", error);
    throw Errors.forbidden("Invalid authentication token.");
  }
}
