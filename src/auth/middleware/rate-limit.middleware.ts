import { NextFunction, Request, Response } from "express";
import { rateLimitRepository } from "../repositories/rate-limit.repository";
import { HttpStatus } from "../../core/types/types";

export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const url = req.originalUrl;
    const ip = req.ip!;

    const amountOfCalls = await rateLimitRepository.find(ip, url);
    console.log(amountOfCalls)
    if (amountOfCalls >= 5) {
        res.sendStatus(HttpStatus.TooManyRequests);
        return;
    } 
    await rateLimitRepository.create(ip, url)
    next()

}