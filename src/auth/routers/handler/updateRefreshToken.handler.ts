import { Response } from "express";
import { HttpStatus, RequestWithUserId } from "../../../core/types/types";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { jwtService } from "../../application/jwtService";
import { securityDeviceService } from "../../../security/application/securityDevice.service";
import { DeviceType } from "../../../security/types/device.type";

export async function updateRefreshTokenHandler(req: RequestWithUserId<{id: string}>, res: Response) {
  try {
    const userId = req.user.id;
    const refreshToken = await jwtService.decodeToken(req.cookies.refreshToken);
    const ip = req.ip;

    let deviceName;
    if (!req.headers['user-agent']) {
      deviceName = "Unknown";
    } else {
      deviceName = req.headers['user-agent'];
    }

    const newRefreshToken = await jwtService.updateRefreshToken(userId, refreshToken.deviceId);
    const a = await jwtService.decodeToken(newRefreshToken);
    console.log("a: ", a);
    console.log("New refreshLogin: ", newRefreshToken);
    await jwtService.deleteRefreshToken(req.cookies.refreshToken);
    const accessToken = await jwtService.createToken(userId);
    const rTBody = await jwtService.decodeToken(req.cookies.refreshToken);

    const sessionBody: DeviceType = {
      ip: ip!,
      title: deviceName!,
      lastActiveDate: new Date(rTBody.iat! * 1000),
      deviceId: refreshToken.deviceId,
      userId: userId,
    }
    await securityDeviceService.updateSession(sessionBody);

    const MAX_AGE = refreshToken.exp! - refreshToken.iat!;
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: MAX_AGE * 1000,
    });
    res.status(HttpStatus.Ok).send({ accessToken: accessToken });
  } catch (e) {
    console.error("Update refresh token error: ", e);
    errorsHandler(e, res);
  }
}
