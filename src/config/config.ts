const ENVConfig = {
  baseURL: process.env.REACT_APP_API_BASE_URL ?? "",
  // REST calls that need the httpOnly refresh-token cookie go through this
  // instead of baseURL — in prod it's a same-origin Vercel rewrite path
  // (see vercel.json) that proxies to the real API host. Safari's ITP treats
  // a cookie set by a genuinely different domain (api on its own domain,
  // frontend on Vercel) as third-party and blocks/evicts it, which broke
  // silent token refresh every time on Safari. Routing through a same-origin
  // path makes the cookie first-party. Sockets (see GroupDetails/ChatModule)
  // don't carry this cookie dependency, so they keep using baseURL directly —
  // WebSocket upgrades aren't reliably proxyable through Vercel rewrites.
  apiBaseURL: process.env.REACT_APP_API_PROXY_URL || process.env.REACT_APP_API_BASE_URL || "",
  googleClientId: process.env.REACT_APP_GOOGLE_CLIENT_ID ?? "",
  vapidKey: process.env.REACT_APP_VAPID_KEY ?? "",
  enviroment: process.env.REACT_APP_ENV ?? "",
  crypto_secret_key: process.env.REACT_APP_CRYPTO_SECRET_KEY ?? "",
  crypto_iv_key: process.env.REACT_APP_CRYPTO_IV ?? "",
};

export default ENVConfig;
