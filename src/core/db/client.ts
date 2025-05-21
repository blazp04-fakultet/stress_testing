import { Client, Pool } from "jsr:@jersey/postgres";
import { config } from "../config/mod.ts";

// Create a connection pool
export const pool = new Pool(
  {
    user: config.database.username,
    password: config.database.password,
    database: config.database.name,
    hostname: config.database.host,
    port: config.database.port,
    tls: { enabled: false },
  },
  20
);

export async function getConnection() {
  return await pool.connect();
}

export function connectToDatabase() {
  return pool.connect();
}

export async function executeQuery(query: string, params: any[] = []) {
  const connection = await getConnection();
  try {
    return await connection.queryObject(query, params);
  } finally {
    connection.release();
  }
}
