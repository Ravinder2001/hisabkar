const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
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

const client = require("./configuration/db");

require("./jobs/cronJob");
require("./configuration/db");
require("./configuration/redis");
require("./queues/settlementReport.queue");

const port = config.PORT;

const app = express();

// Load SSL certificate and key from environment variables
// const sslOptions = {
//   key: config.SSL.KEY,
//   cert: config.SSL.CERT,
// };

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
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Query timed out")), 5000));
    await Promise.race([queryPromise, timeoutPromise]);
    res.status(200).json({ success: 1 });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(503).json({ success: 0, message: "Service unavailable" });
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
