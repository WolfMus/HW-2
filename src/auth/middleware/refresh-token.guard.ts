import { NextFunction, Request, Response } from "express";

export const refreshTokenGuard = async (req: Request, res: Response, next: NextFunction) => {

    const refreshToken = req.cookies.refreshToken;

    console.log("ВХОД В ЗАЩИТНИКА: ", refreshToken)

    next();
}