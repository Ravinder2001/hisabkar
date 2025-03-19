import CryptoJS from "crypto-js";
import ENVConfig from "../config/config";

const SECRET_KEY = CryptoJS.enc.Utf8.parse(ENVConfig.crypto_secret_key); // 32 bytes
const IV = CryptoJS.enc.Utf8.parse(ENVConfig.crypto_iv_key); // 16 bytes

const decryptData = (encryptedData: string) => {
  try {
    // Restore original base64 string
    let base64String = encryptedData
      .replace(/-/g, "+") // Restore '+' from '-'
      .replace(/_/g, "/"); // Restore '/' from '_'

    // Pad with '=' to make length multiple of 4 if needed
    const paddingLength = (4 - (base64String.length % 4)) % 4;
    base64String += "=".repeat(paddingLength);

    // Decrypt the data
    const decrypted = CryptoJS.AES.decrypt(base64String, SECRET_KEY, {
      iv: IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    // Convert the decrypted data to a UTF-8 string
    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

    // Parse the decrypted JSON data
    const data = JSON.parse(decryptedText);

    return data;
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
};

const useDecryption = (encryptedData: string) => {
  const decryptedData = decryptData(encryptedData);
  return decryptedData;
};

export default useDecryption;
