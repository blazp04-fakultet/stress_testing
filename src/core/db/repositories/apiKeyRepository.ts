// apiKeys.ts
import { Client } from "jsr:@jersey/postgres";
import { ApiKey } from "../../models/dto/apiKey.ts";

export interface CreateApiKeyParams {
  id: string;
  key: string;
  role?: string;
}

export async function addApiKey(
  client: Client,
  params: CreateApiKeyParams
): Promise<ApiKey> {
  const { id, key, role = "user" } = params;

  const query = `
  INSERT INTO api_keys (
   id,
    key, 
    role
  ) 
  VALUES ($1, $2,$3)
  RETURNING
    id,
    key,
    role,
    created_at,
    updated_at,
    deleted_at
`;

  const result = await client.queryObject<ApiKey>(query, [id, key, role]);

  if (result.rows.length === 0) {
    throw new Error("Failed to create API key");
  }

  return result.rows[0];
}

export function deleteApiKey() {
  throw new Error("Method not implemented.");
}

export async function validateApiKey(
  client: Client,
  key: string,
  id: string
): Promise<ApiKey | null> {
  const result = await client.queryObject<ApiKey>(
    `
      SELECT 
        id,
        key,
        role,
        created_at,
        updated_at,
        deleted_at
      FROM api_keys
      WHERE key = $1 
        AND id = $2
        AND deleted_at IS NULL
      `,
    [key, id]
  );

  return result.rows.length > 0 ? result.rows[0] : null;
}
