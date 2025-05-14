// src/core/auth/apiKeyAuth.ts
import { type Context } from "@oak/oak";
import { validateApiKey } from "../db/repositories/apiKeyRepository.ts";
import { connectToDatabase } from "../db/client.ts";
import { encryptApiKey } from "../utils/apiKeyUtils.ts";
import {
  setCachedApiKey,
  validateApiKeyCached,
} from "../cache/repository/apiKeyRepository.ts";
import { ApiKey } from "../models/dto/apiKey.ts";

export const apiKeyAuthMiddleware = async (
  ctx: Context,
  next: () => Promise<unknown>
) => {
  const providedKey = ctx.request.headers.get("X-API-KEY");
  if (!providedKey) {
    ctx.response.status = 401;
    ctx.response.body = { error: "Unauthorized: Missing API Key" };
    return;
  }

  const dbClient = await connectToDatabase();
  const encrypted = encryptApiKey(providedKey);

  let validApiKey: ApiKey | null = await validateApiKeyCached(
    encrypted.secret,
    encrypted.key
  );

  if (!validApiKey) {
    console.log("API Key not found in cache, adding to DB...");
    validApiKey = await validateApiKey(
      dbClient,
      encrypted.secret,
      encrypted.key
    );
    if (validApiKey) {
      console.log("API Key found in DB, adding to cache...");
      await setCachedApiKey({ apiKey: validApiKey });
    }
  }

  if (!validApiKey) {
    ctx.response.status = 401;
    ctx.response.body = { error: "Unauthorized: Invalid API Key" };
    return;
  }

  await next();
};
