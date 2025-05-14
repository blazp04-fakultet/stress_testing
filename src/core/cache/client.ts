import { RedisClient } from "@iuioiua/redis";
import { config } from "../config/mod.ts";

const redisConn = await Deno.connect({
  hostname: config.redis.host,
  port: config.redis.port,
});
const redisClient = new RedisClient(redisConn);

export default redisClient;
