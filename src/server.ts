import { Application } from "@oak/oak";
import { type Context } from "@oak/oak";
import { config } from "./core/config/mod.ts";
import v1Router from "./api/v1/routes/index.ts";
import { initializeMigrations } from "./core/db/migrations/migrations.ts";
import BaseRepository from "./core/db/repositories/baseRepository.ts";
import { BaseCachedRepository } from "./core/cache/repository/baseIpRepository.ts";
import HealthService from "./core/services/healthServices.ts";
import MissionCachedRepository from "./core/cache/repository/missionRepository.ts";
import { ApiKeyRepository } from "./core/db/repositories/apiKeyRepository.ts";
import NewsService from "./core/services/newsService.ts";
import { NewsRepository } from "./core/db/repositories/newsRepository.ts";
import { connectToDatabase, getConnection, pool } from "./core/db/client.ts";

const app = new Application();

app.use(v1Router.routes());
app.use(v1Router.allowedMethods());

app.use((ctx: Context) => {
  if (ctx.request.url.pathname === "/") {
    ctx.response.body = { message: "API Root - Welcome!" };
  }
});

app.addEventListener(
  "listen",
  ({
    hostname,
    port,
    secure,
  }: {
    hostname: string;
    port: number;
    secure: boolean;
  }) => {
    console.log(
      `Listening on: ${secure ? "https://" : "http://"}${hostname}:${port}`
    );
  }
);

interface ErrorEvent {
  error: Error;
}

app.addEventListener("error", (evt: ErrorEvent) => {
  console.error("Unhandled application error:", evt.error);
});

let baseRepository: BaseRepository;
let baseCachedRepository: BaseCachedRepository;
let apiKeyRepository: ApiKeyRepository;
let newsrepository: NewsRepository;

let missionCachedRepository: MissionCachedRepository;
let healthService: HealthService;
let newsService: NewsService;

export const startServer = async () => {
  const dbClient = await connectToDatabase();
  console.log("Connected to database");

  await initializeMigrations(dbClient);

  // database
  baseRepository = new BaseRepository(dbClient);
  apiKeyRepository = new ApiKeyRepository(dbClient);
  newsrepository = new NewsRepository(pool);

  // cache
  baseCachedRepository = new BaseCachedRepository();
  missionCachedRepository = new MissionCachedRepository();

  // services
  healthService = new HealthService(
    baseRepository,
    baseCachedRepository,
    missionCachedRepository
  );
  newsService = new NewsService(newsrepository);

  await app.listen({ port: config.port, hostname: config.hostname });
};

export {
  baseRepository,
  apiKeyRepository,
  baseCachedRepository,
  missionCachedRepository,
  healthService,
  newsService,
};
export default app;

//TODO: Napraviti config file za caching
