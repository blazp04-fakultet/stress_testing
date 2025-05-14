import { Client } from "jsr:@jersey/postgres";
import { config } from "../config/mod.ts";

export async function connectToDatabase(): Promise<Client> {
  const client = new Client({
    user: config.database.username,
    password: config.database.password,
    database: config.database.name,
    hostname: config.database.host,
    port: config.database.port,
    tls: { enabled: false },
  });

  await client.connect();
  return client;
}
