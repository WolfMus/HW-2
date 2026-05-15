import { rateLimitModel } from "../models/rateLimit.Schema";
import { RateLimit } from "../types/rate-limit.type";
import { injectable } from "inversify";

@injectable()
export class RateLimitRepository {
  async create(ip: string, url: string): Promise<void> {
    const rateBody: RateLimit = {
      ip: ip,
      url: url,
      date: new Date(),
    };

    await rateLimitModel.insertOne(rateBody);
    return;
  }

  async deleteOld(ip: string, url: string, tenSecondsAgo: Date): Promise<void> {
    await rateLimitModel.deleteMany({
      ip: ip,
      url: url,
      date: { $lte: tenSecondsAgo },
    });
    return;
  }

  async find(ip: string, url: string, tenSecondsAgo: Date): Promise<number> {
    const founded = await rateLimitModel.countDocuments({
      ip: ip,
      url: url,
      date: { $gte: tenSecondsAgo },
    });
    if (!founded) return 0;
    return founded;
  }
}
