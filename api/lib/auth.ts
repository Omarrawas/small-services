import { auth } from "./firebase-admin";
import { findUserByUnionId } from "../queries/users";
import { Errors } from "../../contracts/errors";

async function verifyTokenWithRestApi(idToken: string) {
  const apiKey =
    process.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyDJMfencP299e89zPg31MaVKdQS489cgzM";

  const res = await fetch(
    `https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    },
  );

  if (!res.ok) {
    throw new Error(`Token verification failed: ${res.status}`);
  }

  const data = await res.json();
  const account = data.users?.[0];
  if (!account) {
    throw new Error("No account found for token");
  }

  return {
    uid: account.localId,
    displayName: account.displayName,
    email: account.email,
    photoURL: account.photoUrl,
  };
}

export async function authenticateRequest(headers: Headers) {
  const authHeader = headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw Errors.forbidden("Missing or invalid authorization header");
  }

  const idToken = authHeader.split("Bearer ")[1];

  try {
    let uid: string;
    let displayName: string | undefined;
    let email: string | undefined;
    let photoURL: string | undefined;

    if (auth) {
      const decodedToken = await auth.verifyIdToken(idToken);
      uid = decodedToken.uid;
      const fbUser = await auth.getUser(uid);
      displayName = fbUser.displayName ?? undefined;
      email = fbUser.email ?? undefined;
      photoURL = fbUser.photoURL ?? undefined;
    } else {
      const result = await verifyTokenWithRestApi(idToken);
      uid = result.uid;
      displayName = result.displayName;
      email = result.email;
      photoURL = result.photoURL;
    }

    let user = await findUserByUnionId(uid);
    if (!user) {
      const { upsertUser } = await import("../queries/users");
      user = await upsertUser({
        unionId: uid,
        name: displayName || "Anonymous",
        email: email,
        avatar: photoURL,
        lastSignInAt: new Date(),
      });
    }
    return user;
  } catch (error) {
    console.error("[Auth] Token verification failed", error);
    throw Errors.forbidden("Invalid authentication token.");
  }
}
