const { createClient } = require("redis");
const config = require("./config");

// Create the connection to Redis
const redisClient = createClient({
  url: config.REDIS_URL,
});

// Print a message if it connects successfully
redisClient.on("connect", () => {
  console.log("✅ Redis Client Connected");
});

// Print an error if it fails
redisClient.on("error", (err) => {
  console.log("❌ Redis Client Error", err);
});

// Start the connection and flush cache on startup
redisClient.connect().then(async () => {
  if (config.NODE_ENV === "prod") {
    try {
      await redisClient.flushAll();
      console.log("🧹 Redis Cache Cleared on Startup (Prod)");
    } catch (err) {
      console.log("❌ Failed to clear Redis Cache", err);
    }
  }
});

// Export it so we can use it in other files later
module.exports = redisClient;
