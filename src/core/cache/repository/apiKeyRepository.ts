import { Reply } from "@iuioiua/redis";
import { ApiKey } from "../../models/dto/apiKey.ts";
import { getCache, setCache } from "../cacheService.ts";

export const validateApiKeyCached = async (
  key: string,
  id: string
): Promise<ApiKey | null> => {
  const cacheKey = `apiKey:${id}:${key}`;
  const cachedApiKey: Reply = await getCache(cacheKey);

  if (cachedApiKey) {
    return JSON.parse(cachedApiKey.toString()) as ApiKey;
  }

  return null;
};

export const setCachedApiKey = async ({ apiKey }: { apiKey: ApiKey }) => {
  const cacheKey = `apiKey:${apiKey.id}:${apiKey.key}`;
  await setCache(cacheKey, JSON.stringify(apiKey));
};
