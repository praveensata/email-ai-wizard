
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Fix the Firebase configuration to use valid env variables or provide fallback values
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "email-generative.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "email-generative",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "email-generative.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "126448829",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:126448829:web:529f3d26b41f91d7b5f3d4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
