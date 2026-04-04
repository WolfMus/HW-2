import { Response } from "express";
import { IdType } from "../../../core/types/id";
import { HttpStatus, RequestWithUserId } from "../../../core/types/types";
import { jwtService } from "../../application/jwtService";
import { errorsHandler } from "../../../core/errors/errors.handler";

export async function refreshTokenLogoutHandler(
  req: RequestWithUserId<IdType>,
  res: Response,
) {
  try {
    const refreshToken = req.cookies.refreshToken;
    await jwtService.addToBlackList(refreshToken);
    res.sendStatus(HttpStatus.NoContent);
  } catch (e) {
    errorsHandler(e, res);
  }
}
