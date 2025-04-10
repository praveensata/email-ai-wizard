
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration with direct values to ensure functionality
const firebaseConfig = {
  apiKey: "AIzaSyAWCYesIIni93tfY_YNAlkqFj7ODdWa6JM",
  authDomain: "email-generative.firebaseapp.com",
  projectId: "email-generative",
  storageBucket: "email-generative.appspot.com",
  messagingSenderId: "126448829",
  appId: "1:126448829:web:529f3d26b41f91d7b5f3d4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
