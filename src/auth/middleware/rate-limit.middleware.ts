import { NextFunction, Request, Response } from "express";
import { rateLimitRepository } from "../repositories/rate-limit.repository";
import { HttpStatus } from "../../core/types/types";
import { subSeconds } from "date-fns";

export const rateLimitMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const url = req.originalUrl;
  const ip = req.ip!;
  const tenSecondsAgo = subSeconds(new Date(), 10);

  await rateLimitRepository.deleteOld(ip, url, tenSecondsAgo);

  const amountOfCalls = await rateLimitRepository.find(ip, url, tenSecondsAgo);
  console.log(amountOfCalls);
  if (amountOfCalls >= 5) {
    res.sendStatus(HttpStatus.TooManyRequests);
    return;
  }
  await rateLimitRepository.create(ip, url);

  next();
};
