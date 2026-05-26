import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDJMfencP299e89zPg31MaVKdQS489cgzM",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "taskaty-f87b9.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "taskaty-f87b9",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "taskaty-f87b9.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "830856372835",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:830856372835:web:07bbe602b90e4f226b8e56",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

