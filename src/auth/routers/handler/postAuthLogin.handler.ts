import { Response } from "express";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { HttpStatus, RequestWithBody } from "../../../core/types/types";
import { LoginInputModel } from "../../types/login-input.type";
import { authService } from "../../../composition-root";

export async function authLoginHandler(
  req: RequestWithBody<LoginInputModel>,
  res: Response,
) {
  try {
    const loginOrEmail = req.body.loginOrEmail;
    const password = req.body.password;
    const ip = req.ip!;
    const title = req.headers["user-agent"]!;

    const { accessToken, refreshToken, refreshTokenBody } =
      await authService.login(loginOrEmail, password, ip, title);

    // Отправка куков
    const MAX_AGE = refreshTokenBody.exp! - refreshTokenBody.iat!;
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: MAX_AGE * 1000,
    });

    res.status(HttpStatus.Ok).send({ accessToken: accessToken });
  } catch (e) {
    console.error("Login error:", e);
    errorsHandler(e, res);
  }
}
