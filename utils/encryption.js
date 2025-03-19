const crypto = require("crypto");
const config = require("../configuration/config");

const SECRET_KEY = Buffer.from(config.CRYPTO.SECRET_KEY, "utf-8"); // 32 bytes
const IV = Buffer.from(config.CRYPTO.IV_KEY, "utf-8"); // 16 bytes

const encryptData = (data) => {
  const cipher = crypto.createCipheriv("aes-256-cbc", SECRET_KEY, IV);
  let encrypted = cipher.update(JSON.stringify(data));
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  // Make base64 URL-safe by replacing '+' with '-', '/' with '_', and removing '='
  let base64String = encrypted.toString("base64");
  return base64String
    .replace(/\+/g, "-") // Replace '+' with '-'
    .replace(/\//g, "_") // Replace '/' with '_'
    .replace(/=+$/, ""); // Remove trailing '='
};

const decryptData = (encryptedData) => {
  // Restore original base64 string
  let base64String = encryptedData
    .replace(/-/g, "+") // Restore '+' from '-'
    .replace(/_/g, "/"); // Restore '/' from '_'

  // Pad with '=' to make length multiple of 4 if needed
  const paddingLength = (4 - (base64String.length % 4)) % 4;
  base64String += "=".repeat(paddingLength);

  const decipher = crypto.createDecipheriv("aes-256-cbc", SECRET_KEY, IV);
  let decrypted = decipher.update(Buffer.from(base64String, "base64"));
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return JSON.parse(decrypted.toString());
};

module.exports = { encryptData, decryptData };
