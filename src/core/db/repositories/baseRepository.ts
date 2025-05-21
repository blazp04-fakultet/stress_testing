import { Client } from "@jersey/postgres";

class BaseRepository {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  getBaseIp(droneId: string) {
    return `drones/${droneId}/`;
  }

  async setBaseIp(droneId: string, ip: string): Promise<boolean> {
    const query = `
    INSERT INTO base_station (
      dron_id,
      ip
    ) VALUES (
      $1,
      $2
    ) ON CONFLICT (dron_id) DO UPDATE SET
      ip = $2
    RETURNING 1
  `;
    const result = await this.client.queryObject<boolean>(query, [droneId, ip]);

    return result.rows[0];
  }
}

export default BaseRepository;
