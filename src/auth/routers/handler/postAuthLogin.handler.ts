import { Response } from "express";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { HttpStatus, RequestWithBody } from "../../../core/types/types";
import { LoginInputModel } from "../../types/login-input.type";
import bcrypt from "bcrypt";
import { jwtService, securityService, usersQueryRepo } from "../../../composition-root";

export async function authLoginHandler(
  req: RequestWithBody<LoginInputModel>,
  res: Response,
) {
  try {
    // Проверка пароля
    const loginOrEmail = req.body.loginOrEmail;
    const password = req.body.password;
    const user = await usersQueryRepo.findLoginOrEmailOrFail(loginOrEmail);
    const ispasswordCorrect = await bcrypt.compare(password, user.hash);
    if (!ispasswordCorrect) {
      return res.sendStatus(HttpStatus.Unauthorized);
    }

    // Создание токенов
    const accessToken = await jwtService.createToken(user.id);
    const refreshToken = await jwtService.createRefreshToken(user.id);
    const refreshTokenBody = await jwtService.decodeToken(refreshToken);

    // Работа с сессиями
    const ip = req.ip!;
    const title = req.headers["user-agent"]!;
    await securityService.add(
      user.id,
      refreshTokenBody.deviceId,
      title,
      ip,
      new Date(refreshTokenBody.iat! * 1000),
    );
    
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
