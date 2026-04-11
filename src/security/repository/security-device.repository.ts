import { WithId } from "mongodb";
import { securityDeviceCollection } from "../../db/mongo.db";
import { DeviceType } from "../types/device.type";
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";

export const securityDeviceRepository = {
  async create(deviceBody: DeviceType): Promise<void> {
    await securityDeviceCollection.insertOne(deviceBody);
    return;
  },

  async update(sessionBody: DeviceType): Promise<void> {
    const updated = await securityDeviceCollection.updateOne({
      userId: sessionBody.userId,
      deviceId: sessionBody.deviceId,
    }, {$set: sessionBody})
    if (updated.matchedCount < 1) {
      throw new RepositoryNotFoundError("Session was not found", "session");
    }
    return;
  },

  async deleteMany(userId: string, deviceId: string): Promise<void> {
    await securityDeviceCollection.deleteMany({
      userId: userId,
      deviceId: { $ne: deviceId },
    });
    return;
  },

  async delete(userId: string, deviceId: string): Promise<void> {
    const deleted = await securityDeviceCollection.deleteOne({
      userId: userId,
      deviceId: deviceId,
    });
    if (deleted.deletedCount < 1) {
      throw new RepositoryNotFoundError("Session was not founded", "deviceId");
    }
    return;
  },

  async findMany(userId: string): Promise<WithId<DeviceType>[]> {
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

  async findOne(userId: string, deviceId: string): Promise<WithId<DeviceType>> {
    const founded = await securityDeviceCollection.findOne({
      userId: userId,
      deviceId: deviceId,
    });
    if (!founded) {
      throw new RepositoryNotFoundError("Device id not found", "deviceId");
    };
    return founded;
  },
};
