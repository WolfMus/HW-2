import { Response } from "express";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { HttpStatus, RequestWithBody } from "../../../core/types/types";
import { LoginInputModel } from "../../types/login-input.type";
import { usersQwRepository } from "../../../users/repository/usersQw.repository";
import bcrypt from "bcrypt";
import { jwtService } from "../../application/jwtService";

export async function authLoginHandler(
  req: RequestWithBody<LoginInputModel>,
  res: Response,
) {
  try {
    const loginOrEmail = req.body.loginOrEmail;
    const password = req.body.password;

    const user = await usersQwRepository.findLoginOrEmailOrFail(loginOrEmail);

    const passwordToHash = await bcrypt.hash(password, user!.hash);

    if (user!.hash !== passwordToHash) {
      res.sendStatus(HttpStatus.Unauthorized);
    }

    const accessToken = await jwtService.createToken(user.id);

    const refreshTokenId = await jwtService.createRefreshToken(user.id);
    const refreshToken = await jwtService.findRefreshToken(refreshTokenId);

    const maxAge = refreshToken.expiredAt.getTime() - refreshToken.createdAt.getTime();

    // console.log("REFRESH TOKEN: ", refreshToken);
    console.log("ACCESS TOKEN: ", accessToken)
    res.cookie("refreshToken", refreshToken.refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: maxAge,
    });

    // Логируем заголовки перед отправкой
    // console.log("Set-Cookie header:", res.getHeader("Set-Cookie"));

    res.status(HttpStatus.Ok).send({ accessToken: accessToken });
  } catch (e) {
    console.error("Login error:", e);
    errorsHandler(e, res);
  }
}
