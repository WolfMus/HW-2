import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/types";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { jwtService } from "../../application/jwtService";

export async function updateRefreshTokenHandler(req: Request, res: Response) {
    try {
        console.log("ВХОД В ОБНОВЛЕНИЕ")
        const refreshToken = await jwtService.verifyRefreshToken(req.cookies.refreshToken);

        await jwtService.addToBlackList(req.cookies.refreshToken);

        const newRefreshTokenId = await jwtService.createRefreshToken(refreshToken!.sub);
        const newRefreshToken = await jwtService.findRefreshTokenById(newRefreshTokenId);
        const maxAge = newRefreshToken.expiresAt.getTime() - newRefreshToken.createdAt.getTime();

        const accessToken = await jwtService.createToken(refreshToken!.sub);


        res.cookie("refreshToken", newRefreshToken.refreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: maxAge,
        })
        res.status(HttpStatus.Ok).send({accessToken: accessToken});
    } catch(e) {
        errorsHandler(e, res);
    }
}