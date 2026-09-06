import crypto from "crypto";
import config from "../config/config.js";
export const symmetricEncryption = (text) => {
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    Buffer.from(config.ENCRYPTION_SECRET_KEY, "hex"),
    iv,
  );

  let cipherivText = cipher.update(text, "utf8", "hex");
  cipherivText += cipher.final("hex");
  const authTag = cipher.getAuthTag();
  return {
    encryptedData: cipherivText,
    iv: iv.toString("hex"),
    authTag: authTag.toString("hex"),
  };
};

export const decryption = (cipherivText, iv, authTag) => {
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    Buffer.from(config.ENCRYPTION_SECRET_KEY, "hex"),
    Buffer.from(iv, "hex"),
  );
  decipher.setAuthTag(Buffer.from(authTag, "hex"));
  let plainText = decipher.update(cipherivText, "hex", "utf8");
  plainText += decipher.final("utf8");
  return plainText;
};
