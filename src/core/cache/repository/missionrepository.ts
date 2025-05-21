import { getCache, setCache } from "../cacheService.ts";

class MissionCachedRepository {
  getMissionCacheStatus = async ({ droneId }: { droneId: string }) => {
    const key = `mission:status:${droneId}`;
    return await getCache(key);
  };

  setMissionCacheStatus = async ({
    status,
    droneId,
  }: {
    status: string;
    droneId: string;
  }) => {
    const key = `mission:status:${droneId}`;
    await setCache(key, status);
  };
}

export default MissionCachedRepository;
