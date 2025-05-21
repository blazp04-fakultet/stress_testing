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

  async getNews(
    author: number,
    page: number = 1,
    pageSize: number = 10
  ): Promise<News[] | null> {
    const connection = await this.pool.connect();
    try {
      const offset = (page - 1) * pageSize;
      const result = await connection.queryObject<News>(
        `
      SELECT 
        news_id,
        title,
        content,
        author_id
      FROM news
      WHERE author_id = $1 
      ORDER BY news_id DESC
      LIMIT $2 OFFSET $3
      `,
        [author, pageSize, offset]
      );

      return result.rows;
    } finally {
      connection.release();
    }
  }
}
