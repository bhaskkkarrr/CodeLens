import { getAuth } from "firebase-admin/auth";
import { admin } from "../config/firebase.js";

export const decodeFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) {
    return res.status(402).json({
      success: false,
      message: "Not a valid user, access denied",
    });
  }

  if (authHeader.split(" ")[0] != "Bearer") {
    return res.status(402).json({
      success: false,
      message: "Invalid token, access denied",
    });
  }
  let firebaseIdToken = authHeader.split(" ")[1];

  const firebaseResponse = await getAuth(admin).verifyIdToken(firebaseIdToken);

  if (!firebaseResponse) {
    return res.status(400).json({
      success: false,
      message: "User not found",
    });
  }
  req.firebaseUser = firebaseResponse;
  console.log(firebaseResponse);

  next();
};
