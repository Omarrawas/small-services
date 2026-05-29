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

  const data = (await res.json()) as any;
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
  console.log("[Auth] Authorization header present:", !!authHeader);
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.warn("[Auth] Missing or invalid authorization header format.");
    throw Errors.forbidden("Missing or invalid authorization header");
  }

  const idToken = authHeader.split("Bearer ")[1];
  console.log("[Auth] Token length:", idToken?.length);


  try {
    let uid: string;
    let displayName: string | undefined;
    let email: string | undefined;
    let photoURL: string | undefined;

    try {
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
    } catch (fbErr: any) {
      console.error("[Auth] Firebase verification failed:", fbErr.message);
      throw Errors.forbidden(`فشل التحقق من الحساب في Firebase: ${fbErr.message}`);
    }

    let user;
    try {
      user = await findUserByUnionId(uid);
      if (!user) {
        console.log("[Auth] User not found in DB, creating new user for UID:", uid);
        const { upsertUser } = await import("../queries/users");
        user = await upsertUser({
          unionId: uid,
          name: displayName || "Anonymous",
          email: email,
          avatar: photoURL,
          lastSignInAt: new Date(),
        });
      }
    } catch (dbErr: any) {
      console.error("[Auth] Database error during auth:", dbErr.message);
      throw Errors.internal(`فشل مزامنة بياناتك مع قاعدة البيانات: ${dbErr.message}`);
    }
    
    if (!user) {
      throw Errors.internal("فشل استرجاع بيانات المستخدم من قاعدة البيانات بعد المزامنة.");
    }
    
    return user;

  } catch (error: any) {
    console.error("[Auth] Overall auth failure:", error);
    if (error.code) throw error; // Re-throw specialized errors
    throw Errors.forbidden(error.message || "فشل غير معروف في المصادقة.");
  }
}
