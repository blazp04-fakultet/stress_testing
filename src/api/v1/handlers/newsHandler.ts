import { type Context } from "@oak/oak";
import { News, NewsDetailsDTO } from "../../../core/models/dto/newsModel.ts";
import { getNews } from "../../../core/db/repositories/newsrepository.ts";
import { connectToDatabase } from "../../../core/db/client.ts";
import {
  getCachedNews,
  setCachedApiKey,
} from "../../../core/cache/repository/newsrepository.ts";

export const postNewsDetails = async (ctx: Context) => {
  try {
    const requestBody = ctx.request.body;
    const body: NewsDetailsDTO = await requestBody.json();

    if (!body.id) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Invalid request params" };
      return;
    }

    //! Rezultati sa cachingom
    const cachedNews = await getCachedNews(body.id);
    if (cachedNews) {
      ctx.response.status = 200;
      ctx.response.body = { newsList: cachedNews };
      ctx.response.type = "json";
      return;
    }

    //! Rezultati bez cachinga
    const dbClient = await connectToDatabase();
    const newsList: News[] | null = await getNews(dbClient, body.id);
    if (!newsList) {
      ctx.response.status = 404;
      ctx.response.body = { error: "News not found" };
      return;
    }
    //! Spremanje u cache
    await setCachedApiKey({ id: body.id, news: newsList });

    if (!newsList) {
      ctx.response.status = 404;
      ctx.response.body = { error: "News not found" };
      return;
    }

    ctx.response.status = 200;
    ctx.response.body = { newsList };
    ctx.response.type = "json";
  } catch (e) {
    console.log(e);
  }
};
