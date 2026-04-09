import { Router } from "express";
import { refreshTokenGuard } from "../../auth/middleware/refresh-token.guard";
import { getDevicesListHandler } from "./handlers/get-list-of-devices.handler";
import { deleteAllDevicesHandler } from "./handlers/delete-list-of-devices.handler";
import { deleteOneDeviceHandler } from "./handlers/delete-one-device.handler";

export const securityRouter = Router({})

securityRouter
    .get("/devices", refreshTokenGuard, getDevicesListHandler)
    .delete("/devices", refreshTokenGuard, deleteAllDevicesHandler)
    .delete("/devices/:deviceId", refreshTokenGuard, deleteOneDeviceHandler)