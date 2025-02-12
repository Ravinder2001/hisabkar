const ENVConfig = {
  baseURL: process.env.REACT_APP_API_BASE_URL ?? "",
  googleClientId: process.env.REACT_APP_GOOGLE_CLIENT_ID ?? "",
  vapidKey: process.env.REACT_APP_VAPID_KEY ?? "",
};

export default ENVConfig;
