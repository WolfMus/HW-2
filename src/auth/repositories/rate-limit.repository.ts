import { subSeconds } from "date-fns";
import { rateLimitCollection } from "../../db/mongo.db"
import { RateLimit } from "../types/rate-limit.type"

export const rateLimitRepository = {
  async create(ip: string, url: string): Promise<string> {
    const rateBody: RateLimit = {
      ip: ip,
      url: url,
      date: new Date(),
    };

    const created = await rateLimitCollection.insertOne(rateBody);
    return created.insertedId.toString();
  },

  async find(ip: string, url: string): Promise<number> {
    const founded = await rateLimitCollection
      .find({ ip: ip, url: url, date: { $gte: subSeconds(new Date(), 10) } })
      .toArray();
    if (!founded) return 0;
    return founded.length;
  },
};