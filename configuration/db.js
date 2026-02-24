const { Pool } = require("pg");
const config = require("../configuration/config");

const isProduction = process.env.NODE_ENV === "prod" || process.env.NODE_ENV === "production";

const poolConfig = {
  user: config.DB.USER,
  host: config.DB.HOST,
  database: config.DB.DATABASE,
  password: config.DB.PASSWORD,
  port: config.DB.PORT,
  // Crucial for Serverless:
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
  max: 10, // Keep pool small for free tier
};

if (isProduction && process.env.PG_CA_CERT) {
  const pem = Buffer.from(process.env.PG_CA_CERT, "base64").toString("utf-8");
  poolConfig.ssl = {
    rejectUnauthorized: true,
    ca: pem,
  };
}

const pool = new Pool(poolConfig);

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool: pool,
};
