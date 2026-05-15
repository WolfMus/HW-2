import mongoose, { model } from "mongoose";
import { DeviceType } from "../types/device.type";

const devicesSchema = new mongoose.Schema<DeviceType>({
  ip: {type: String, required: true},
  title: {type: String, required: true},
  lastActiveDate: {type: Date, required: true},
  deviceId: {type: String, required: true},
  userId: {type: String, required: true},
})

export const devicesModel = model<DeviceType>("Devices", devicesSchema);