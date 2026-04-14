import { WithId } from "mongodb";
import { securityDeviceRepository } from "../repository/security-device.repository";
import { DeviceType } from "../types/device.type";
import { DeviceViewType } from "../types/device-view.type";

export const securityDeviceService = {
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
    await securityDeviceRepository.create(deviceBody);
    return;
  },

  async updateSession(sessionBody: DeviceType): Promise<void> {
    return await securityDeviceRepository.update(sessionBody);
  },

  async deleteMany(userId: string, deviceId: string): Promise<void> {
    return await securityDeviceRepository.deleteMany(userId, deviceId);
  },

  async deleteOne(userId: string, deviceId: string): Promise<void> {
    return await securityDeviceRepository.delete(userId, deviceId);
  },

  async findMany(userId: string): Promise<DeviceViewType[]> {
    const devices = await securityDeviceRepository.findMany(userId);
    return devices.map((device) => this._toViewModel(device));
  },

  async findUserId(deviceId: string): Promise<string> {
    const session = await securityDeviceRepository.findUserId(deviceId);
    return session.userId;
  },

  async findByUserAndDeviceId(userId: string, deviceId: string): Promise<DeviceViewType | null> {
    const session = await securityDeviceRepository.findOne(userId, deviceId);
    if (!session) {
      return null;
    }
    return this._toViewModel(session);
  },

  _toViewModel(device: WithId<DeviceType>): DeviceViewType {
    return {
      ip: device.ip,
      title: device.title,
      lastActiveDate: device.lastActiveDate,
      deviceId: device.deviceId,
    };
  },
};
