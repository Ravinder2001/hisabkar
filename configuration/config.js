const fs = require("fs");

const config = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  DEMO_GROUP_ID: process.env.DEMO_GROUP_ID,
  ALLOWED_ORIGIN: process.env.ALLOWED_ORIGIN,
  DB: {
    USER: process.env.DB_USER,
    HOST: process.env.DB_HOST,
    DATABASE: process.env.DB_NAME,
    PASSWORD: process.env.DB_PASSWORD,
    PORT: process.env.DB_PORT,
    PG_CA_CERT: process.env.PG_CA_CERT,
  },
  JWT: {
    SECRET_KEY: process.env.SECRET,
  },
  CRYPTO: {
    SECRET_KEY: process.env.CRYPTO_SECRET_KEY ?? "",
    IV_KEY: process.env.CRYPTO_IV ?? "",
  },
  NODEMAILER: {
    EMAIL: process.env.EMAIL,
    PASSWORD: process.env.PASSWORD,
  },
  AVATAR_WEBSITE: process.env.AVATAR_WEBSITE,
  VAPID: {
    PUBLIC_KEY: process.env.VAPID_PUBLIC_KEY,
    PRIVATE_KEY: process.env.VAPID_PRIVATE_KEY,
  },
  GOOGLE: {
    GOOGLE_INFO_ENDPOINT: process.env.GOOGLE_USER_INFO_ENDPOINT,
  },
  SSL:
    process.env.IS_SSL_REQUIRED === "true"
      ? {
          KEY: fs.readFileSync(process.env.SSL_KEY),
          CERT: fs.readFileSync(process.env.SSL_CERT),
        }
      : null,
  OPENROUTER: {
    API_KEY: process.env.OPENROUTER_API_KEY,
    BASE_URL: "https://openrouter.ai/api/v1",
    MODELS: ["deepseek/deepseek-chat", "meta-llama/llama-3-70b-instruct", "mistralai/mixtral-8x7b-instruct"],
  },
  CHATBOT_DAILY_LIMIT: process.env.CHATBOT_DAILY_LIMIT || 5,
  REDIS_URL: process.env.REDIS_URL,
};

module.exports = config;
