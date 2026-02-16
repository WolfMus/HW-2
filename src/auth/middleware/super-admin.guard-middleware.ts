import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../core/types/types";

export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'qwerty';

export const adminAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const auth = req.header("authorization");
    if (typeof auth !== 'string') {
        res.sendStatus(HttpStatus.Unauthorized);
        return
    }
    
    const [authType, token] = auth.split(' ');
    if (authType !== "Basic") {
        res.sendStatus(HttpStatus.Unauthorized);
        return
    }
    if (!token) {
        res.sendStatus(HttpStatus.Unauthorized);
        return
    }

    const credentials = Buffer.from(token, "base64").toString('utf-8');
    const [username, password] = credentials.split(':');

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
        res.sendStatus(HttpStatus.Unauthorized);
        return
    }

    next();
}
