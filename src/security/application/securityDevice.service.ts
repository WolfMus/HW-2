import { WithId } from "mongodb";
import { SecurityDeviceRepository } from "../repository/security-device.repository";
import { DeviceType } from "../types/device.type";
import { DeviceViewType } from "../types/device-view.type";

export class SecurityDeviceService {
  private securityRepo: SecurityDeviceRepository;
  constructor(securityRepo: SecurityDeviceRepository){
    this.securityRepo = securityRepo;
  }

  async add(
    userId: string,
    deviceId: string,
    title: string,
    ip: string,
    lastActiveDate: Date,
  ): Promise<void> {
    const deviceBody: DeviceType = {
      ip: ip,
      title: title,
      lastActiveDate: lastActiveDate,
      deviceId: deviceId,
      userId: userId,
    };
    await this.securityRepo.create(deviceBody);
    return;
  }

  async updateSession(sessionBody: DeviceType): Promise<void> {
    return await this.securityRepo.update(sessionBody);
  }

  async deleteMany(userId: string, deviceId: string): Promise<void> {
    return await this.securityRepo.deleteMany(userId, deviceId);
  }

  async deleteOne(userId: string, deviceId: string): Promise<void> {
    return await this.securityRepo.delete(userId, deviceId);
  }

  async findMany(userId: string): Promise<DeviceViewType[]> {
    const devices = await this.securityRepo.findMany(userId);
    return devices.map((device) => this._toViewModel(device));
  }

  async findUserId(deviceId: string): Promise<string> {
    const session = await this.securityRepo.findUserId(deviceId);
    return session.userId;
  }

  async findByUserAndDeviceId(userId: string, deviceId: string): Promise<DeviceViewType | null> {
    const session = await this.securityRepo.findOne(userId, deviceId);
    if (!session) {
      return null;
    }
    return this._toViewModel(session);
  }

  _toViewModel(device: WithId<DeviceType>): DeviceViewType {
    return {
      ip: device.ip,
      title: device.title,
      lastActiveDate: device.lastActiveDate,
      deviceId: device.deviceId,
    };
  }
};
