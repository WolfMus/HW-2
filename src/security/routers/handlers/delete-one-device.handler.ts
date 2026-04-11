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

    // ПРОВЕРКА НА ДРУГОГО ЮЗЕРА
    const userId_2 = await securityDeviceService.findUserId(deviceId);

    if (userId_2 === userId) {
      await securityDeviceService.deleteOne(userId, deviceId);
      res.sendStatus(HttpStatus.NoContent);
    } else {
      res.sendStatus(HttpStatus.Forbidden);
    }
  } catch (e) {
    errorsHandler(e, res);
  }
}
