import { NextFunction, Request, Response } from "express";
import { rateLimitRepository } from "../repositories/rate-limit.repository";

export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const url = req.originalUrl;
    const ip = req.ip!;

    const amountOfCalls = await rateLimitRepository.find(ip, url);
    console.log(amountOfCalls)
    if (amountOfCalls >= 5) {
        // await rateLimitRepository.deleteAll(ip, url)
        throw new Error('Wait a few seconds')
        return;
    } 
    const rate = await rateLimitRepository.create(ip, url)

    next()
    /*
    >take IP
    >take URL
    >check amount of calls from this IP for last 10 seconds
    >if <5 => add in DB
    >if >5 => remove oldest and add new
    */
}