import { getCache, setCache } from "../cacheService.ts";

export const getMissionCacheStatus = async ({
  droneId,
}: {
  droneId: string;
}) => {
  const key = `mission:status:${droneId}`;
  return await getCache(key);
};

export const setMissionCacheStatus = async ({
  status,
  droneId,
}: {
  status: string;
  droneId: string;
}) => {
  const key = `mission:status:${droneId}`;
  await setCache(key, status);
};
