const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => {
  console.error("Redis Error:", err);
});

const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }

  console.log("Redis connected successfully");
};

const CACHE_KEYS = {
  SUMMARY: (userId) => `stats:summary:user:${userId}`
};

// Delete the cached summary for a user (clears the per-user key).

const isRedisReady = () => redisClient.isOpen && redisClient.isReady;

// Read a cached value. Returns null on miss or when Redis is unavailable.
const getCache = async (key) => {
  if (!isRedisReady()) return null;

  try {
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error("Redis GET error:", error.message);
    return null;
  }
};

// Store a value with a TTL (in seconds). Caching failures never break the request.
const setCache = async (key, value, ttlSeconds = 60) => {
  if (!isRedisReady()) return;

  try {
    await redisClient.set(key, JSON.stringify(value), { EX: ttlSeconds });
  } catch (error) {
    console.error("Redis SET error:", error.message);
  }
};

// Delete the cached summary for a user (clears the per-user key).
const deleteUserSummary = async (userId) => {
  if (!isRedisReady()) return;
  try {
    await redisClient.del([CACHE_KEYS.SUMMARY(userId)]);
  } catch (error) {
    console.error("Redis DEL error:", error.message);
  }
};

// Remove one or more cache keys.
const deleteCache = async (...keys) => {
  if (!isRedisReady()) return;

  try {
    await redisClient.del(keys);
  } catch (error) {
    console.error("Redis DEL error:", error.message);
  }
};

module.exports = {
  redisClient,
  connectRedis,
  CACHE_KEYS,
  getCache,
  setCache,
  deleteCache,
  deleteUserSummary
};