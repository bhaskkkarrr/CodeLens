import { Redis } from "ioredis";
import config from "./config.js";

const redisClient = new Redis(process.env.REDIS_URL);
redisClient.on("connect", () => {
  console.log("Redis connected successfully");
});

redisClient.on("error", (error) => {
  console.error("Redis connection error:", error);
});

export default redisClient;
