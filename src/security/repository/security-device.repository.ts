import { WithId } from "mongodb";
import { securityDeviceCollection } from "../../db/mongo.db";
import { DeviceType } from "../types/device.type";
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";

export const securityDeviceRepository = {
  async create(deviceBody: DeviceType): Promise<void> {
    await securityDeviceCollection.insertOne(deviceBody);
    return;
  },

  async deleteMany(userId: string, deviceId: string): Promise<void> {
    await securityDeviceCollection.deleteMany({
      userId: userId,
      deviceId: { $ne: deviceId },
    });
    return;
  },

  async delete(deviceId: string): Promise<void> {
    const deleted = await securityDeviceCollection.deleteOne({
      deviceId: deviceId,
    });
    if (deleted.deletedCount < 1) {
      throw new RepositoryNotFoundError("Session was not founded", "deviceId");
      return;
    }
    return;
  },

  async find(userId: string): Promise<WithId<DeviceType>[]> {
    const founded = await securityDeviceCollection
      .find({ userId: userId })
      .toArray();
    return founded;
  },

  async findUserId(deviceId: string): Promise<WithId<DeviceType>> {
    const founded = await securityDeviceCollection.findOne({deviceId: deviceId})
    if (!founded) {
      throw new RepositoryNotFoundError("Device id not found", "deviceId")
    };
    return founded;
  },
};
