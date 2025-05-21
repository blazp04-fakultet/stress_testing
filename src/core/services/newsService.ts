import { NewsRepository } from "../db/repositories/newsRepository.ts";
import { News } from "../models/dto/newsModel.ts";

class NewsService {
  newsRepository: NewsRepository;

  constructor(newsRepository: NewsRepository) {
    this.newsRepository = newsRepository;
  }

  public async getNews(id: number): Promise<News[] | null> {
    const response = await this.newsRepository.getNews(id, 1, 5);
    return response;
  }
}

export default NewsService;
