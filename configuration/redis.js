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

// Start the connection
redisClient.connect();

// Export it so we can use it in other files later
module.exports = redisClient;
