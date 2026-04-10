import { Request, Response } from "express";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { HttpStatus } from "../../../core/types/types";
import { securityDeviceService } from "../../../security/application/securityDevice.service";
import { jwtService } from "../../application/jwtService";

export async function refreshTokenLogoutHandler(
  req: Request,
  res: Response,
) {
  try {
    const refreshToken = await jwtService.verifyRefreshToken(req.cookies.refreshToken);
    await securityDeviceService.deleteOne(refreshToken!.sub, refreshToken!.deviceId)
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
