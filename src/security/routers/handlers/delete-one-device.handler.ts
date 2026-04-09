import { Response } from "express";
import {
  HttpStatus,
  RequestWithParamsAndUserId,
} from "../../../core/types/types";
import { IdType } from "../../../core/types/id";
import { securityDeviceService } from "../../application/securityDevice.service";
import { errorsHandler } from "../../../core/errors/errors.handler";

export async function deleteOneDeviceHandler(
  req: RequestWithParamsAndUserId<{ deviceId: string }, IdType>,
  res: Response,
) {
  try {
      const deviceId = req.params.deviceId;
      const userId = req.user.id;
      console.log("ВХОД В DELETE ONE DEVICE")
      console.log("DEVICE ID: ", deviceId);
      console.log("userId: ", userId);

    // ПРОВЕРКА НА ДРУГОГО ЮЗЕРА
    const deviceIdUserId = await securityDeviceService.findUserId(deviceId);
    console.log("User 2: ", deviceIdUserId);
    if (deviceIdUserId === userId) {
      await securityDeviceService.deleteOne(deviceId);
      res.sendStatus(HttpStatus.NoContent);
    } else {
      res.sendStatus(HttpStatus.Forbidden);
    }
  } catch (e) {
    errorsHandler(e, res);
  }
}
