import { type Context } from "@oak/oak";
import { News, NewsDetailsDTO } from "../../../core/models/dto/newsModel.ts";
import { getNews } from "../../../core/db/repositories/newsrepository.ts";
import { connectToDatabase } from "../../../core/db/client.ts";
import {
  getCachedNews,
  setCachedApiKey,
} from "../../../core/cache/repository/newsrepository.ts";
import { newsService } from "../../../server.ts";

export const postNewsDetails = async (ctx: Context) => {
  try {
    const requestBody = ctx.request.body;
    const body: NewsDetailsDTO = await requestBody.json();

    if (!body.id) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Invalid request params" };
      return;
    }

    const newsList: News[] | null = await newsService.getNews(body.id);
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
