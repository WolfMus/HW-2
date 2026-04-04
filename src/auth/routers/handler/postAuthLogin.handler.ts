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
      return;
    }

    const accessToken = await jwtService.createToken(user.id);

    const refreshTokenId = await jwtService.createRefreshToken(user.id);
    const refreshTokenBody = await jwtService.findRefreshTokenById(refreshTokenId);

    const token = await jwtService.verifyRefreshToken(refreshTokenBody.refreshToken)
    const maxAge = token!.exp - token!.iat;

    console.log("ACCESS TOKEN: ", accessToken)
    res.cookie("refreshToken", refreshTokenBody.refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: maxAge * 1000,
    });

    res.status(HttpStatus.Ok).send({ accessToken: accessToken });
  } catch (e) {
    console.error("Login error:", e);
    errorsHandler(e, res);
  }
}
