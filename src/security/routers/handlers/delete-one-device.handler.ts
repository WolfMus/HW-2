import { Response } from "express";
import {
  HttpStatus,
  RequestWithParamsAndUserId,
} from "../../../core/types/types";
import { IdType } from "../../../core/types/id";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { securityService } from "../../../composition-root";

export async function deleteOneDeviceHandler(
  req: RequestWithParamsAndUserId<{ deviceId: string }, IdType>,
  res: Response,
) {
  try {
    const deviceId = req.params.deviceId;
    const userId = req.user.id;

    // ПРОВЕРКА НА ДРУГОГО ЮЗЕРА
    const userId_2 = await securityService.findUserId(deviceId);

    if (userId_2 === userId) {
      await securityService.deleteOne(userId, deviceId);
      res.sendStatus(HttpStatus.NoContent);
    } else {
      res.sendStatus(HttpStatus.Forbidden);
    }
  } catch (e) {
    errorsHandler(e, res);
  }
}
