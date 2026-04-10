import { Response } from "express";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { HttpStatus, RequestWithBody } from "../../../core/types/types";
import { LoginInputModel } from "../../types/login-input.type";
import { usersQwRepository } from "../../../users/repository/usersQw.repository";
import bcrypt from "bcrypt";
import { jwtService } from "../../application/jwtService";
import { securityDeviceService } from "../../../security/application/securityDevice.service";

export async function authLoginHandler(
  req: RequestWithBody<LoginInputModel>,
  res: Response,
) {
  try {

    // Проверка пароля
    const loginOrEmail = req.body.loginOrEmail;
    const password = req.body.password;
    const user = await usersQwRepository.findLoginOrEmailOrFail(loginOrEmail);
    const ispasswordCorrect = await bcrypt.compare(password, user.hash);
    if (!ispasswordCorrect) {
      return res.sendStatus(HttpStatus.Unauthorized);
    }

    const accessToken = await jwtService.createToken(user.id);
    const refreshToken = await jwtService.createRefreshToken(user.id);
    const refreshTokenBody = await jwtService.verifyRefreshToken(refreshToken);
    
    const ip = req.ip!;
    const title = req.headers['user-agent']!;
    await securityDeviceService.add(user.id, refreshTokenBody!.deviceId, title, ip, refreshTokenBody!.iat);
    
    const MAX_AGE = 20; //seconds
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
