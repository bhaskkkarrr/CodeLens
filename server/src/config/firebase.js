import { initializeApp,cert } from "firebase-admin/app";
import config from "./config.js";
const firebaseConfig = {
  projectId: config.FIREBASE_PROJECT_ID,
  clientEmail: config.FIREBASE_CLIENT_EMAIL,
  privateKey: config.FIREBASE_PRIVATE_KEY,
};
export const admin = initializeApp({
  credential: cert(firebaseConfig),
});
