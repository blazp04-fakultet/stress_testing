import { Application } from "@oak/oak";
import { type Context } from "@oak/oak";
import { config } from "./core/config/mod.ts";
import v1Router from "./api/v1/routes/index.ts";
import { connectToDatabase } from "./core/db/client.ts";
import { initializeMigrations } from "./core/db/migrations/migrations.ts";

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

export const startServer = async () => {
  const dbClient = await connectToDatabase();
  console.log("Connected to database");

  await initializeMigrations(dbClient);

  await app.listen({ port: config.port, hostname: config.hostname });
};

export default app;
