import { News } from "../../models/dto/newsModel.ts";
import { getCache, setCache } from "../cacheService.ts";

export const setCachedApiKey = async ({
  id,
  news,
}: {
  id: number;
  news: News[];
}) => {
  const cacheKey = `news:${id}`;
  await setCache(cacheKey, JSON.stringify(news));
};

export const getCachedNews = async (id: number): Promise<News[] | null> => {
  const cacheKey = `news:${id}`;
  const cachedNews = await getCache(cacheKey);

  if (cachedNews) {
    return JSON.parse(cachedNews.toString()) as News[];
  }

  return null;
};
