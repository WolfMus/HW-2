import { NextFunction, Request, Response } from "express";
import { IdType } from "../../core/types/id";
import { HttpStatus } from "../../core/types/types";
import { jwtService } from "./tokenGuard.guard";

export const optionalTokenGuard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
    // ЕСТЬ ЛИ АВТОРИЗАЦИЯ
  if (!req.headers.authorization) {
    return next();
  }

  // ТИП АВТОРИЗАЦИИ
  const auth = req.header("Authorization");
  if (typeof auth !== "string") {
    return res.sendStatus(HttpStatus.Unauthorized);
  }

  const [authType, token] = auth!.split(" ");
  if (authType !== "Bearer") {
    return res.sendStatus(HttpStatus.Unauthorized);
  }
  if (!token) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }

  const payload = await jwtService.verifyToken(token);

  if (payload) {
    const { userId } = payload;

    req.user = { id: userId } as IdType;

    return next();
  }

  return res.sendStatus(HttpStatus.Unauthorized);
};
