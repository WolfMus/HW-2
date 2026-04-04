import { NextFunction, Request, Response } from "express";
import { jwtService } from "../application/jwtService";
import { HttpStatus } from "../../core/types/types";
import { errorsHandler } from "../../core/errors/errors.handler";
import { IdType } from "../../core/types/id";

export const refreshTokenGuard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }
  try {
    const isBlocked = await jwtService.isBlocked(refreshToken);
    if (isBlocked === true) {
      return res.sendStatus(HttpStatus.Unauthorized);
    }

    const payload = await jwtService.verifyRefreshToken(refreshToken);

    if (!payload) {
      res.sendStatus(HttpStatus.Unauthorized);
      return;
    }

    const userId = payload.sub;

    req.user = { id: userId } as IdType;

    next();
  } catch (e) {
    errorsHandler(e, res);
    return;
  }
};
