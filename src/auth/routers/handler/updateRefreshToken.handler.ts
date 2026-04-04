import { Response } from "express";
import { HttpStatus, RequestWithUserId } from "../../../core/types/types";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { jwtService } from "../../application/jwtService";

export async function updateRefreshTokenHandler(req: RequestWithUserId<{id: string}>, res: Response) {
  try {
    console.log("ВХОД В ОБНОВЕНИЕ")
    const userId = req.user.id;

    await jwtService.addToBlackList(req.cookies.refreshToken);
    
    const newRefreshTokenId = await jwtService.createRefreshToken(userId);
    const newRefreshToken = await jwtService.findRefreshTokenById(newRefreshTokenId);
    const accessToken = await jwtService.createToken(userId);

    const MAX_AGE = 20;

    res.cookie("refreshToken", newRefreshToken.refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: MAX_AGE * 1000,
    });
    res.status(HttpStatus.Ok).send({ accessToken: accessToken });
  } catch (e) {
    console.error("Update refresh token error: ", e);
    errorsHandler(e, res);
  }
}
