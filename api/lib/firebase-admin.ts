import admin from "firebase-admin";
import { env } from "./env";

function getFirebaseApp() {
  try {
    if (!env.firebase.projectId || !env.firebase.clientEmail || !env.firebase.privateKey) {
      console.warn("[Firebase Admin] Skipping initialization: Missing credentials in environment variables.");
      return null;
    }
    
    if (!admin.apps.length) {
      console.log("[Firebase Admin] Initializing for project:", env.firebase.projectId);
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: env.firebase.projectId,
          clientEmail: env.firebase.clientEmail,
          privateKey: env.firebase.privateKey,
        }),
      });
    }
    return admin;
  } catch (error) {
    console.error("[Firebase Admin] Initialization failed:", error);
    return null;
  }
}


const app = getFirebaseApp();

export const auth = app?.auth() ?? null;
export const db = app?.firestore() ?? null;
