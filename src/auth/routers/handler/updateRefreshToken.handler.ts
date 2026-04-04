import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/types";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { jwtService } from "../../application/jwtService";

export async function updateRefreshTokenHandler(req: Request, res: Response) {
  try {
    const refreshToken = await jwtService.verifyRefreshToken(
      req.cookies.refreshToken,
    );

    await jwtService.addToBlackList(req.cookies.refreshToken);

    const newRefreshTokenId = await jwtService.createRefreshToken(
      refreshToken!.sub,
    );
    const newRefreshToken =
      await jwtService.findRefreshTokenById(newRefreshTokenId);

    const accessToken = await jwtService.createToken(refreshToken!.sub);

    const token = await jwtService.verifyRefreshToken(
      newRefreshToken.refreshToken,
    );
    const maxAge = token!.exp - token!.iat;

    res.cookie("refreshToken", newRefreshToken.refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: maxAge * 1000,
    });
    res.status(HttpStatus.Ok).send({ accessToken: accessToken });
  } catch (e) {
    console.error("Update refresh token error: ", e);
    errorsHandler(e, res);
  }
}
