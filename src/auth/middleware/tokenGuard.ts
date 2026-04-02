import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../core/types/types";
import { jwtService } from "../application/jwtService";
import { IdType } from "../../core/types/id";

export const tokenGuard = async (req: Request, res: Response, next: NextFunction) => {

  // ЕСТЬ ЛИ АВТОРИЗАЦИЯ
  if (!req.headers.authorization) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }

  // ТИП АВТОРИЗАЦИИ
  const auth = req.header("Authorization");
  if (typeof auth !== "string") {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }
  
  const [authType, token] = auth!.split(" ");
  if (authType !== "Bearer") {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }
  if (!token) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }
  
  const payload = await jwtService.verifyToken(token);
  
  if (payload) {
    const {userId} = payload;
    
    req.user = {id: userId} as IdType

    next();
    return;
  }

  res.sendStatus(HttpStatus.Unauthorized)
  return;
};
