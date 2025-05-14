import { parse, load } from "@bearz/dotenv";

const env = parse(await Deno.readTextFile(".env"));
await load(env);

export const config = {
  port: parseInt(Deno.env.get("PORT") ?? "4242", 10),
  hostname: Deno.env.get("HOSTNAME") ?? "0.0.0.0",
  database: {
    username: Deno.env.get("DATABASE_USERNAME") ?? "user",
    password: Deno.env.get("DATABASE_PASSWORD") ?? "password",
    host: Deno.env.get("DATABASE_HOST") ?? "host",
    port: parseInt(Deno.env.get("DATABASE_PORT") ?? "5432", 10),
    name: Deno.env.get("DATABASE_NAME") ?? "database",
    url: Deno.env.get("DATABASE_URL") ?? "",
  },
  redis: {
    host: Deno.env.get("REDIS_HOST") ?? "127.0.0.1",
    port: parseInt(Deno.env.get("REDIS_PORT") ?? "6379", 10),
  },
  superbaseSecret: Deno.env.get("SUPERBASE_JWT_SECRET") ?? "default-secret-key",
};

if (!config.database) {
  console.error("Missing required environment variable: DATABASE_URL");
  Deno.exit(1);
}
