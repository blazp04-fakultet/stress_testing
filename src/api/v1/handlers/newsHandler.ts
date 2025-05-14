import { type Context } from "@oak/oak";
import { News } from "../../../core/models/dto/newsModel.ts";
import { getNews } from "../../../core/db/repositories/newsrepository.ts";
import { connectToDatabase } from "../../../core/db/client.ts";

export const postNewsDetails = async (ctx: Context) => {
  try {
    // if (!newsId) {
    //   ctx.response.status = 400;
    //   ctx.response.body = { error: "Invalid request params" };
    //   return;
    // }

    //TODO: Ovdje ide cachiranje,
    const dbClient = await connectToDatabase();

    const newsList: News[] | null = await getNews(dbClient, 1);

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
