// src/api/v1/handlers/userHandlers.ts
import { type Context } from "@oak/oak";

export const getAllUsers = (ctx: Context) => {
  ctx.response.status = 200;
  ctx.response.type = "json";
  ctx.response.body = [];
  return;
  //   try {
  //     // 1. Try fetching from cache
  //     const cacheKey = "users:all";
  //     const cachedUsers = await redisClient?.get(cacheKey);

  //     if (cachedUsers) {
  //       console.log("Serving users from cache");
  //       ctx.response.body = JSON.parse(cachedUsers);
  //       ctx.response.type = "json";
  //       return;
  //     }

  //     // 2. If not in cache, fetch from DB
  //     console.log("Fetching users from DB");
  //     const result =
  //       await dbPool.queryObject`SELECT id, username, email FROM users`; // Adjust query

  //     // 3. Store in cache (with expiration)
  //     if (redisClient) {
  //       await redisClient.setex(cacheKey, 300, JSON.stringify(result.rows)); // Cache for 5 minutes (300 seconds)
  //     }

  //     ctx.response.body = result.rows;
  //     ctx.response.type = "json";
  //   } catch (error) {
  //     console.error("Error fetching users:", error);
  //     // Use a centralized error handler later
  //     ctx.response.status = 500;
  //     ctx.response.body = { error: "Internal Server Error" };
  //   }
};
