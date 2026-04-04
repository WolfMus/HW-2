 import { blackListCollection } from "../../db/mongo.db";

export const blackListRepository = {
  async create(refreshToken: string): Promise<string> {
    const created = await blackListCollection.insertOne({ refreshToken });
    return created.insertedId.toString();
  },

  async find(refreshToken: string): Promise<boolean> {
    const token = await blackListCollection.findOne({
      refreshToken: refreshToken,
    });
    if (!token) {return false}
    return true;
  },
};
