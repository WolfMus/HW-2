import { Response } from "express";
import { HttpStatus, RequestWithUserId } from "../../../core/types/types";
import { IdType } from "../../../core/types/id";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { jwtService, securityService } from "../../../composition-root";

export async function deleteAllDevicesHandler(
  req: RequestWithUserId<IdType>,
  res: Response,
) {
  try {
    const userId = req.user.id;
    const refreshToken = await jwtService.verifyRefreshToken(
      req.cookies.refreshToken,
    );

    await securityService.deleteMany(userId, refreshToken!.deviceId);

    res.sendStatus(HttpStatus.NoContent);
  } catch (e) {
    errorsHandler(e, res);
  }
}
