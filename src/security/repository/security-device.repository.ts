import { WithId } from "mongodb";
import { DeviceType } from "../types/device.type";
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";
import { UnauthorizedError } from "../../core/errors/unauthorizedError.error";
import { injectable } from "inversify";
import { devicesModel } from "../models/device.Schema";

@injectable()
export class SecurityDeviceRepository {
  async create(deviceBody: DeviceType): Promise<void> {
    await devicesModel.insertOne(deviceBody);
    return;
  }

  async update(sessionBody: DeviceType): Promise<void> {
    const updated = await devicesModel.updateOne(
      {
        userId: sessionBody.userId,
        deviceId: sessionBody.deviceId,
      },
      { $set: sessionBody },
    );
    if (updated.matchedCount < 1) {
      throw new RepositoryNotFoundError("Session was not found", "session");
    }
    return;
  }

  async deleteMany(userId: string, deviceId: string): Promise<void> {
    await devicesModel.deleteMany({
      userId: userId,
      deviceId: { $ne: deviceId },
    });
    return;
  }

  async delete(userId: string, deviceId: string): Promise<void> {
    const deleted = await devicesModel.deleteOne({
      userId: userId,
      deviceId: deviceId,
    });
    if (deleted.deletedCount < 1) {
      throw new UnauthorizedError("Session was not founded", "deviceId");
    }
    return;
  }

  async findMany(userId: string): Promise<WithId<DeviceType>[]> {
    const founded = await devicesModel
      .find({ userId: userId })
      .lean();
    return founded;
  }

  async findUserId(deviceId: string): Promise<WithId<DeviceType>> {
    const founded = await devicesModel.findOne({
      deviceId: deviceId,
    });
    if (!founded) {
      throw new RepositoryNotFoundError("Device id not found", "deviceId");
    }
    return founded;
  }

  async findOne(
    userId: string,
    deviceId: string,
  ): Promise<WithId<DeviceType> | null> {
    const founded = await devicesModel.findOne({
      userId: userId,
      deviceId: deviceId,
    });
    return founded || null;
  }
}
