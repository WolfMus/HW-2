import { Response } from "express";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { HttpStatus, RequestWithUserId } from "../../../core/types/types";
import { securityDeviceService } from "../../../security/application/securityDevice.service";
import { jwtService } from "../../application/jwtService";
import { IdType } from "../../../core/types/id";

export async function refreshTokenLogoutHandler(
  req: RequestWithUserId<IdType>,
  res: Response,
) {
  try {
    const userId = req.user.id;
    const refreshToken = await jwtService.decodeToken(req.cookies.refreshToken);
    await securityDeviceService.deleteOne(userId, refreshToken.deviceId);
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    })
    res.sendStatus(HttpStatus.NoContent);
  } catch (e) {
    errorsHandler(e, res);
    return;
  }
}
