import { Redis } from "@upstash/redis";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "..", "..", ".env"), quiet: true });

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const createNoopRedis = () => ({
  isConfigured: false,
  async get() {
    return null;
  },
  async set() {
    return null;
  },
  async del() {
    return null;
  },
});

const redis =
  redisUrl && redisToken
    ? Object.assign(
        new Redis({
          url: redisUrl,
          token: redisToken,
        }),
        { isConfigured: true }
      )
    : createNoopRedis();

if (!redis.isConfigured) {
  console.warn("Upstash Redis is not configured. Caching and token persistence will run in fallback mode.");
}

export default redis;
