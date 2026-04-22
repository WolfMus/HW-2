import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../core/types/types";
import { subSeconds } from "date-fns";
import { rateLimitRepo } from "../../composition-root";

export const rateLimitMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const url = req.originalUrl;
  const ip = req.ip!;
  const tenSecondsAgo = subSeconds(new Date(), 10);

  await rateLimitRepo.deleteOld(ip, url, tenSecondsAgo);
  await rateLimitRepo.create(ip, url);

  const amountOfCalls = await rateLimitRepo.find(ip, url, tenSecondsAgo);
  console.log(amountOfCalls);
  if (amountOfCalls > 5) {
    console.log("Too many requests. Wait 10 sec");
    res.sendStatus(HttpStatus.TooManyRequests);
    return;
  }
  next();
};
