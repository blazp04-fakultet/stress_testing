import { getCache, setCache } from "../cacheService.ts";

// export const getBaseCachedIp = async ({ droneId }: { droneId: string }) => {
//   const key = `baseIp:${droneId}`;
//   return await getCache(key);
// };

// export const setBaseCacheIp = async ({
//   ip,
//   droneId,
// }: {
//   ip: string;
//   droneId: string;
// }) => {
//   const key = `baseIp:${droneId}`;
//   await setCache(key, ip);
// };

export class BaseCachedRepository {
  getBaseCachedIp = async ({ droneId }: { droneId: string }) => {
    const key = `baseIp:${droneId}`;
    return await getCache(key);
  };

  async setBaseCacheIp({
    ip,
    droneId,
  }: {
    ip: string;
    droneId: string;
  }): Promise<void> {
    const key = `baseIp:${droneId}`;
    await setCache(key, ip);
  }
}
