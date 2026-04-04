import { NextFunction, Request, Response } from "express";
import { jwtService } from "../application/jwtService";
import { HttpStatus } from "../../core/types/types";

export const refreshTokenGuard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const refreshToken = req.cookies.refreshToken;

  // ПРОВЕРКА КУКОВ
  if (!refreshToken) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }
  const isBlocked = await jwtService.isBlocked(refreshToken);
  if (isBlocked === true) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }

  const token = await jwtService.verifyRefreshToken(refreshToken)

  if(token!.exp < Date.now())

  next();
};
