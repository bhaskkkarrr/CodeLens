import { getAuth, GithubAuthProvider, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "codelens-ae7e0.firebaseapp.com",
  projectId: "codelens-ae7e0",
  storageBucket: "codelens-ae7e0.firebasestorage.app",
  messagingSenderId: "664071052272",
  appId: "1:664071052272:web:2375a39cb02653ae07db35",
  measurementId: "G-L2KSD6S0R5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
export const githubAuthProvider = new GithubAuthProvider();
