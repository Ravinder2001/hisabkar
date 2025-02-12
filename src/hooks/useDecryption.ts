import CryptoJS from "crypto-js";
import ENVConfig from "../config/config";

const SECRET_KEY = CryptoJS.enc.Utf8.parse(ENVConfig.crypto_secret_key); // 32 bytes
const IV = CryptoJS.enc.Utf8.parse(ENVConfig.crypto_iv_key); // 16 bytes

const decryptData = (encryptedData: string) => {
  const decrypted = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY, {
    iv: IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

  try {
    const data = JSON.parse(decryptedText);

    return data;
  } catch {
    return null;
  }
};

const useDecryption = (encryptedData: string) => {
  const decryptedData = decryptData(encryptedData);

  return decryptedData;
};

export default useDecryption;
