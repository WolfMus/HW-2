import "reflect-metadata";
import { Response } from "express";
import { errorsHandler } from "../../core/errors/errors.handler";
import {
  RequestWithBody,
  HttpStatus,
  RequestWithUserId,
} from "../../core/types/types";
import { LoginInputModel } from "../types/login-input.type";
import { IdType } from "../../core/types/id";
import { DeviceType } from "../../security/types/device.type";
import { UserInput } from "../../users/type/user-input.interface";
import { ConfirmationCodeType } from "../types/confirmation-code.type";
import { AuthService } from "../application/authService";
import { UsersQwRepository } from "../../users/repository/usersQw.repository";
import { JwtService } from "../application/jwtService";
import { SecurityDeviceService } from "../../security/application/securityDevice.service";
import { NodeMailerService } from "../application/nodeMailerService";
import { UsersService } from "../../users/application/users.service";
import { NewPasswordRecoveryInputModel } from "../types/new-password-inputModel";
import { inject, injectable } from "inversify";
import { UsersRepository } from "../../users/repository/users.repository";

@injectable()
export class AuthController {
  constructor(
    @inject(AuthService) protected authService: AuthService,
    @inject(JwtService) protected jwtService: JwtService,
    @inject(NodeMailerService) protected emailService: NodeMailerService,
    @inject(SecurityDeviceService) protected securityService: SecurityDeviceService,
    @inject(UsersRepository) protected usersRepo: UsersRepository,
    @inject(UsersQwRepository) protected usersQueryRepo: UsersQwRepository,
    @inject(UsersService) protected usersService: UsersService,
  ) {}

  async authLogin(req: RequestWithBody<LoginInputModel>, res: Response) {

    try {
      const loginOrEmail = req.body.loginOrEmail;
      const password = req.body.password;
      const ip = req.ip!;
      const title = req.headers["user-agent"]!;

      const { accessToken, refreshToken, refreshTokenBody } =
        await this.authService.login(loginOrEmail, password, ip, title);

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

  // ✅ Переделал
  async getInformationAboutUser(req: RequestWithUserId<IdType>, res: Response) {
    try {
      const userId = req.user.id;
      const me = await this.usersService.findById(userId);

      const meToView = {
        email: me.email,
        login: me.login,
        userId: me.id,
      };

      res.status(HttpStatus.Ok).send(meToView);
    } catch (e) {
      errorsHandler(e, res);
    }
  }

  async updateRefreshToken(
    req: RequestWithUserId<{ id: string }>,
    res: Response,
  ) {
    try {
      const userId = req.user.id;
      const refreshToken = await this.jwtService.decodeToken(
        req.cookies.refreshToken,
      );
      const ip = req.ip;

      let deviceName;
      if (!req.headers["user-agent"]) {
        deviceName = "Unknown";
      } else {
        deviceName = req.headers["user-agent"];
      }

      const newRefreshToken = await this.jwtService.updateRefreshToken(
        userId,
        refreshToken.deviceId,
      );
      await this.jwtService.deleteRefreshToken(req.cookies.refreshToken);
      const accessToken = await this.jwtService.createToken(userId);
      const rTBody = await this.jwtService.decodeToken(newRefreshToken);

      const sessionBody: DeviceType = {
        ip: ip!,
        title: deviceName!,
        lastActiveDate: new Date(rTBody.iat! * 1000),
        deviceId: refreshToken.deviceId,
        userId: userId,
      };
      await this.securityService.updateSession(sessionBody);

      const MAX_AGE = refreshToken.exp! - refreshToken.iat!;
      res.cookie("refreshToken", newRefreshToken, {
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

  async refreshTokenLogout(req: RequestWithUserId<IdType>, res: Response) {
    try {
      const userId = req.user.id;
      const refreshToken = await this.jwtService.decodeToken(
        req.cookies.refreshToken,
      );
      await this.securityService.deleteOne(userId, refreshToken.deviceId);
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
      });
      res.sendStatus(HttpStatus.NoContent);
    } catch (e) {
      errorsHandler(e, res);
      return;
    }
  }

  // ✅ Переделал
  async registration(req: RequestWithBody<UserInput>, res: Response) {
    try {
      const login = req.body.login;
      const email = req.body.email;
      const password = req.body.password;

      await this.usersService.registerUser(login, email, password);
      res.sendStatus(HttpStatus.NoContent);
    } catch (e) {
      errorsHandler(e, res);
    }
  }

  // ✅ Переделал
  async confirmation(
    req: RequestWithBody<ConfirmationCodeType>,
    res: Response,
  ) {
    try {
      const code = req.body.code;
      await this.usersService.checkConfirmationCode(code);
      res.sendStatus(HttpStatus.NoContent);
    } catch (error) {
      errorsHandler(error, res);
    }
  }

  // ✅ Переделал
  async emailResending(req: RequestWithBody<{ email: string }>, res: Response) {
    try {
      const email = req.body.email;

      const confirmationCode = await this.usersService.updateConfirmationCode(email)
      await this.emailService.sendEmail(email, confirmationCode);
      res.sendStatus(HttpStatus.NoContent);
    } catch (e) {
      errorsHandler(e, res);
    }
  }

  // ✅ Переделал
  async passwordRecovery(
    req: RequestWithBody<{ email: string }>,
    res: Response,
  ) {
    try {
      const email = req.body.email;

      const recoveryCode = await this.usersService.updateRecoveryCode(email);
      await this.emailService.sendRecoveryCode(email, recoveryCode);
      res.sendStatus(HttpStatus.NoContent);
    } catch (e) {
      errorsHandler(e, res);
    }
  }

  // ✅ Переделал
  async newPassword(
    req: RequestWithBody<NewPasswordRecoveryInputModel>,
    res: Response,
  ) {
    try {
      const recoveryCode = req.body.recoveryCode;
      const newPassword = req.body.newPassword;

      const {hash, salt} = await this.authService.generateHashAndSalt(newPassword);
      await this.usersService.changePassword(hash, salt, recoveryCode);
      res.sendStatus(HttpStatus.NoContent);
    } catch (e) {
      errorsHandler(e, res);
    }
  }
}

