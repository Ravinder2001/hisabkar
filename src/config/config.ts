const ENVConfig = {
  baseURL: process.env.REACT_APP_API_BASE_URL ?? "",
  googleClientId: process.env.REACT_APP_GOOGLE_CLIENT_ID ?? "",
  vapidKey: process.env.REACT_APP_VAPID_KEY ?? "",
  enviroment: process.env.REACT_APP_ENV ?? "",
  crypto_secret_key: process.env.REACT_APP_CRYPTO_SECRET_KEY ?? "",
  crypto_iv_key: process.env.REACT_APP_CRYPTO_IV ?? "",
};

export default ENVConfig;
