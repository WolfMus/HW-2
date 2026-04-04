import { NextFunction, Request, Response } from "express";
import { jwtService } from "../application/jwtService";
import { HttpStatus } from "../../core/types/types";

export const refreshTokenGuard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const refreshToken = req.cookies.refreshToken;
  console.log("ВХОД В ЗАЩИТНИКА: ", refreshToken);

  // ПРОВЕРКА КУКОВ
  if (!req.cookies.refreshToken) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }
  const isBlocked = await jwtService.isBlocked(req.cookies.refreshToken);
  if (isBlocked === true) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }

  next();
};
