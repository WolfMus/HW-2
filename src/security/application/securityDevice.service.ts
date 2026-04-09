import { WithId } from "mongodb";
import { securityDeviceRepository } from "../repository/security-device.repository";
import { DeviceType } from "../types/device.type"
import { DeviceViewType } from "../types/device-view.type";

export const securityDeviceService = {
    async add(ip: string, userId: string, title: string, lastActiveDate: Date, deviceId: string): Promise<void> {
        const deviceBody: DeviceType = {
            ip: ip,
            userId: userId,
            title: title,
            lastActiveDate: lastActiveDate,
            deviceId: deviceId,
        }

        await securityDeviceRepository.create(deviceBody);
        return;
    },

    async deleteMany(userId: string, deviceId: string): Promise<void> {
        return await securityDeviceRepository.deleteMany(userId, deviceId);
    },

    async deleteOne(deviceId: string): Promise<void> {
        return await securityDeviceRepository.delete(deviceId);
    },

    async find(userId: string): Promise<DeviceViewType[]> {
        const devices = await securityDeviceRepository.find(userId);
        return devices.map((device) => this._toViewModel(device))
    },

    async findUserId(deviceId: string): Promise<string> {
        const session = await securityDeviceRepository.findUserId(deviceId);
        return session.userId
    },

    _toViewModel(device: WithId<DeviceType>): DeviceViewType {
        return {
            ip: device.ip,
            title: device.title,
            lastActiveDate: device.lastActiveDate,
            deviceId: device.deviceId,
        }
    },


}