import { Response } from "express";
import { HttpStatus, RequestWithUserId } from "../../../core/types/types";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { jwtService } from "../../application/jwtService";

export async function updateRefreshTokenHandler(req: RequestWithUserId<{ id: string }>, res: Response) {
    try {
        console.log("ВХОД В ОБНОВЛЕНИЕ")
        const userId = req.user.id;
        const refreshToken = req.cookies.refreshToken;

        await jwtService.addToBlackList(refreshToken);

        const newRefreshTokenId = await jwtService.createRefreshToken(userId);
        const newRefreshToken = await jwtService.findRefreshTokenById(newRefreshTokenId);
        const accessToken = await jwtService.createToken(userId);

        const maxAge = newRefreshToken.expiresAt.getTime() - newRefreshToken.createdAt.getTime();

        res.cookie("refreshToken", newRefreshToken.refreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: maxAge,
        })
        res.status(HttpStatus.NoContent).send(accessToken);
    } catch(e) {
        errorsHandler(e, res);
    }
}