import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZiIbLqg--l3IcvauRjK18-vX9wxn9S3E",
  authDomain: "bruno-dictionary.firebaseapp.com",
  projectId: "bruno-dictionary",
  storageBucket: "bruno-dictionary.firebasestorage.app",
  messagingSenderId: "461887648643",
  appId: "1:461887648643:web:b103f01c5c5d6c56593cb6",
  measurementId: "G-S4HQZZGXNQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services and export them
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
