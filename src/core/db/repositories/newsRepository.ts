// apiKeys.ts
import { Client, Pool } from "jsr:@jersey/postgres";
import { News } from "../../models/dto/newsModel.ts";

export interface CreateApiKeyParams {
  id: string;
  key: string;
  role?: string;
}

export class NewsRepository {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async getNews(autor: number): Promise<News[] | null> {
    const connection = await this.pool.connect();
    try {
      const result = await connection.queryObject<News>(
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
    } finally {
      connection.release();
    }
  }
}
