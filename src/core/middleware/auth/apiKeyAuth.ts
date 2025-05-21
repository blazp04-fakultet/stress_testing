// src/core/auth/apiKeyAuth.ts
import { type Context } from "@oak/oak";
import { encryptApiKey } from "../../utils/apiKeyUtils.ts";
import {
  setCachedApiKey,
  validateApiKeyCached,
} from "../../cache/repository/apiKeyRepository.ts";
import { ApiKey } from "../../models/dto/apiKey.ts";
import { apiKeyRepository } from "../../../server.ts";

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

  const encrypted = encryptApiKey(providedKey);

  let validApiKey: ApiKey | null = await validateApiKeyCached(
    encrypted.secret,
    encrypted.key
  );

  if (!validApiKey) {
    console.log("API Key not found in cache, adding to DB...");
    //TODO: Završiti ovo
    validApiKey = await apiKeyRepository.validateApiKey(
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
