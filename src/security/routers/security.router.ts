import { Router } from "express";
import { refreshTokenGuard } from "../../auth/middleware/refresh-token.guard";
import { container } from "../../composition-root";
import { SecurityController } from "./security-controller";

const securityController = container.get(SecurityController)

export const securityRouter = Router({});

securityRouter
  .get("/devices", refreshTokenGuard, securityController.getDevicesList.bind(securityController))
  .delete("/devices", refreshTokenGuard, securityController.deleteAllDevices.bind(securityController))
  .delete(
    "/devices/:deviceId",
    refreshTokenGuard,
    securityController.deleteOneDevice.bind(securityController),
  );
