import { BaseCachedRepository } from "../cache/repository/baseIpRepository.ts";
import MissionCachedRepository from "../cache/repository/missionRepository.ts";
import BaseRepository from "../db/repositories/baseRepository.ts";

class HealthService {
  baseRepository: BaseRepository;
  baseCachedRepository: BaseCachedRepository;
  missionCachedRepository: MissionCachedRepository;

  constructor(
    baseRepository: BaseRepository,
    baseCachedRepository: BaseCachedRepository,
    missionCachedRepository: MissionCachedRepository
  ) {
    this.baseRepository = baseRepository;
    this.baseCachedRepository = baseCachedRepository;
    this.missionCachedRepository = missionCachedRepository;
  }

  public async healthCheck(
    droneId: string,
    ip: string,
    missionStatus: string
  ): Promise<boolean> {
    const cachedIp = await this.baseCachedRepository.getBaseCachedIp({
      droneId: droneId,
    });
    if (cachedIp != ip) {
      await this.baseCachedRepository.setBaseCacheIp({
        ip: ip,
        droneId: droneId,
      });

      await this.baseRepository.setBaseIp(droneId, ip);
    }

    this.missionCachedRepository.setMissionCacheStatus({
      droneId: droneId,
      status: missionStatus,
    });

    return true;
  }
}

export default HealthService;
