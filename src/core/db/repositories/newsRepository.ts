// apiKeys.ts
import { Client } from "jsr:@jersey/postgres";
import { News } from "../../models/dto/newsModel.ts";

export interface CreateApiKeyParams {
  id: string;
  key: string;
  role?: string;
}

export async function getNews(
  client: Client,
  autor: number
): Promise<News[] | null> {
  const result = await client.queryObject<News>(
    `
      SELECT 
        news_id,
        title,
        content,
        author_id
      FROM news
      WHERE author_id = $1 
      `,
    [autor]
  );

  return result.rows;
}
