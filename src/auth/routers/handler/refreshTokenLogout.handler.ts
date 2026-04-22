import { Response } from "express";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { HttpStatus, RequestWithUserId } from "../../../core/types/types";
import { IdType } from "../../../core/types/id";
import { jwtService, securityService } from "../../../composition-root";

export async function refreshTokenLogoutHandler(
  req: RequestWithUserId<IdType>,
  res: Response,
) {
  try {
    const userId = req.user.id;
    const refreshToken = await jwtService.decodeToken(req.cookies.refreshToken);
    await securityService.deleteOne(userId, refreshToken.deviceId);
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
