import { Request, Response } from "express";
import { jwtService } from "../../application/jwtService";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { HttpStatus } from "../../../core/types/types";

export async function refreshTokenLogoutHandler(
  req: Request,
  res: Response,
) {
  try {
    const refreshToken = req.cookies.refreshToken;
    await jwtService.addToBlackList(refreshToken);
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
