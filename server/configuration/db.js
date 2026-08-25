const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
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

if (isProduction) {
  let caPem = null;
  if (process.env.PG_CA_CERT) {
    const certPath = path.isAbsolute(process.env.PG_CA_CERT) ? process.env.PG_CA_CERT : path.resolve(__dirname, "..", process.env.PG_CA_CERT);

    if (fs.existsSync(certPath)) {
      const raw = fs.readFileSync(certPath, "utf-8").trim();
      caPem = raw.startsWith("-----BEGIN") ? raw : Buffer.from(raw, "base64").toString("utf-8");
    }
  }

  if (caPem) {
    poolConfig.ssl = {
      rejectUnauthorized: true,
      ca: caPem,
    };
  } else {
    poolConfig.ssl = {
      rejectUnauthorized: false,
    };
  }
}

const pool = new Pool(poolConfig);

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

pool.connect((err, client, release) => {
  if (err) {
    console.error("Error connecting to the database:", err.stack);
  } else {
    console.log("🚀 Database connected successfully!");
    release();
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool: pool,
};
