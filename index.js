const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const moment = require("moment");
const helmet = require("helmet");
const https = require("https");
require("dotenv").config(); // Load environment variables

const mainRouter = require("./routes/routes");
const config = require("./configuration/config");
const Messages = require("./utils/constant/messages");
const { encryptData } = require("./utils/encryption");
const client = require("./configuration/db");

require("./jobs/cronJob");
require("./configuration/db");

const port = config.PORT;

const app = express();

// Load SSL certificate and key from environment variables
const sslOptions = {
  key: process.env.SSL_KEY,
  cert: process.env.SSL_CERT,
};

const corsOptions = {
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "x-user-id"],
  optionsSuccessStatus: 200,
  credentials: true,
};

morgan.token("ist-date", () => {
  return moment().utcOffset("+05:30").format("DD/MMM/YYYY:HH:mm:ss Z");
});

morgan.token("user", (req) => {
  return req.userId || "Guest";
});

app.disable("x-powered-by");
app.use(helmet());
app.use(cors(corsOptions));
app.use((req, res, next) => {
  const originalSend = res.json;

  res.json = function (data) {
    if (process.env.NODE_ENV === "prod" && data.data) {
      const encryptedData = encryptData(data.data);
      originalSend.call(this, {
        ...data,
        data: encryptedData,
      });
    } else {
      originalSend.call(this, data);
    }
  };
  next();
});

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      imgSrc: ["'self'"],
      connectSrc: ["'self'"],
      frameAncestors: ["'none'"],
    },
  })
);

app.use(passport.initialize());
app.use(express.json());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-cache, no-store");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use((req, res, next) => {
  const userId = req.headers["x-user-id"];
  if (userId) {
    req.userId = userId;
  }
  next();
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: Messages.INVALID_JSON, message: err.message });
  }
  next();
});

app.use(morgan(":method :url :status - userId: :user - :ist-date"));

app.use("/", mainRouter);

app.get("/health", async (req, res) => {
  try {
    const queryPromise = client.query("SELECT 1");
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Query timed out")), 1000));
    await Promise.race([queryPromise, timeoutPromise]);
    res.status(200).json({ success: 1 });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(503).json({ success: 0, message: "Service unavailable" });
  }
});

// HTTPS Server
https.createServer(sslOptions, app).listen(port, () => {
  console.log(`Express HTTPS Server running on port ${port}`);
});
