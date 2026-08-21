const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const moment = require("moment");
const helmet = require("helmet");
const https = require("https");
const http = require("http");
// const { Server } = require("socket.io");
const initSockets = require("./sockets/index");

const mainRouter = require("./routes/routes");
const config = require("./configuration/config");
const Messages = require("./utils/constant/messages");
const sendEmail = require("./helpers/sendEmail");
const emailContent = require("./utils/constant/emailContent");

const client = require("./configuration/db");

require("./jobs/cronJob");
require("./configuration/db");
require("./configuration/redis");
require("./queues/settlementReport.queue");

// Email ourselves on a fatal, process-level crash (not routine per-request
// errors — those are already handled by handleAsyncError in
// common.controller.js and don't take the process down). Racing the send
// against a timeout keeps a hung SMTP connection from delaying the crash
// exit indefinitely.
const notifyCrash = async (type, error) => {
  console.error(`${type}:`, error);
  try {
    const { subject, text } = emailContent.ServerCrash({
      type,
      message: error?.message || String(error),
      stack: error?.stack || "No stack trace available",
      timestamp: new Date().toISOString(),
    });
    await Promise.race([sendEmail(config.NODEMAILER.EMAIL, { subject, text }), new Promise((resolve) => setTimeout(resolve, 5000))]);
  } catch (emailError) {
    console.error("Failed to send crash notification email:", emailError);
  }
};

process.on("uncaughtException", (error) => {
  notifyCrash("Uncaught Exception", error).finally(() => process.exit(1));
});

process.on("unhandledRejection", (reason) => {
  const error = reason instanceof Error ? reason : new Error(String(reason));
  notifyCrash("Unhandled Rejection", error).finally(() => process.exit(1));
});

const port = config.PORT;

const app = express();

// Load SSL certificate and key from environment variables
// const sslOptions = {
//   key: config.SSL.KEY,
//   cert: config.SSL.CERT,
// };

// If ALLOWED_ORIGIN is configured (comma-separated for multiple), only those
// origins get a credentialed response — required now that a refresh session
// lives in a cookie, since `origin: true` + `credentials: true` otherwise
// lets any site trigger a credentialed request and have the browser attach
// it. Falls back to reflecting any origin (today's behavior) if unset, so
// this doesn't break anything until ALLOWED_ORIGIN is actually set.
const allowedOrigins = config.ALLOWED_ORIGIN
  ? config.ALLOWED_ORIGIN.split(",")
      .map((origin) => origin.trim())
      .filter(Boolean)
  : null;

const corsOptions = {
  origin: allowedOrigins
    ? (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error("Not allowed by CORS"));
      }
    : true,
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
app.use(cookieParser());
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

// Health check DB errors are caught here, so they never reach the
// uncaughtException/unhandledRejection handlers above and never emailed
// anyone on their own. Alert here too, with a cooldown so a run of
// back-to-back failing checks doesn't flood the inbox.
let lastHealthAlertAt = 0;
const HEALTH_ALERT_COOLDOWN_MS = 15 * 60 * 1000;

app.get("/health", async (req, res) => {
  try {
    const queryPromise = client.query("SELECT 1");
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Query timed out")), 5000));
    await Promise.race([queryPromise, timeoutPromise]);
    res.status(200).json({ success: 1 });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(503).json({ success: 0, message: "Service unavailable" });

    const now = Date.now();
    if (now - lastHealthAlertAt > HEALTH_ALERT_COOLDOWN_MS) {
      lastHealthAlertAt = now;
      const { subject, text } = emailContent.HealthCheckFailed({
        message: error?.message || String(error),
        timestamp: new Date().toISOString(),
      });
      sendEmail(config.NODEMAILER.EMAIL, { subject, text }).catch((emailError) => {
        console.error("Failed to send health check alert email:", emailError);
      });
    }
  }
});

// Conditional server startup
if (config.NODE_ENV === "local") {
  // Local HTTP server
  const server = http.createServer(app);
  initSockets(server);
  server.listen(port, () => {
    console.log(`Express HTTP Server with Sockets running on port ${port}`);
  });
} else if (config.NODE_ENV === "prod") {
  if (config.SSL) {
    // HTTPS with SSL certs
    https.createServer(config.SSL, app).listen(port, () => {
      console.log(`Express HTTPS Server running on port ${port}`);
    });

    // HTTP -> HTTPS redirect
    http
      .createServer((req, res) => {
        res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
        res.end();
      })
      .listen(7777, () => {
        process.stdout.write("HTTP Server redirecting to HTTPS on port 7777\n");
      });
  } else {
    // No SSL (Render/other hosts manage HTTPS)
    const server = http.createServer(app);
    initSockets(server);
    server.listen(port, () => {
      console.log(`Express HTTP Server with Sockets running on port ${port}`);
    });
  }
}
