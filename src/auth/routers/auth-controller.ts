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

export class AuthController {
    authService: AuthService;
    jwtService: JwtService;
    emailService: NodeMailerService;
    securityService: SecurityDeviceService;
    usersService: UsersService;
    usersQueryRepo: UsersQwRepository;
  constructor(
    authService: AuthService, 
    jwtService: JwtService,
    emailService: NodeMailerService,
    securityService: SecurityDeviceService,
    usersService: UsersService,
    usersQueryRepo: UsersQwRepository,
) {
    this.authService = authService;
    this.jwtService = jwtService;
    this.emailService = emailService;
    this.securityService = securityService;
    this.usersService = usersService;
    this.usersQueryRepo = usersQueryRepo;
  }

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

  async getInformationAboutUser(
    req: RequestWithUserId<IdType>,
    res: Response,
  ) {
    try {
      const userId = req.user.id;
      const me = await this.usersQueryRepo.findById(userId);

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

  async refreshTokenLogout(
    req: RequestWithUserId<IdType>,
    res: Response,
  ) {
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

  async confirmation(
    req: RequestWithBody<ConfirmationCodeType>,
    res: Response,
  ) {
    try {
      const code = req.body.code;

      await this.authService.checkConfirmationCode(code);

      res.sendStatus(HttpStatus.NoContent);
    } catch (error) {
      errorsHandler(error, res);
    }
  }

  async emailResending(
    req: RequestWithBody<{ email: string }>,
    res: Response,
  ) {
    try {
      const email = req.body.email;

      const user = await this.usersQueryRepo.doesExistByLoginOrEmail(email);

      await this.authService.isConfirmed(user.id);

      const confirmationCode = await this.authService.updateConfirmationCodeForUser(
        user.id,
      );

      await this.emailService.sendEmail(email, confirmationCode);

      res.sendStatus(HttpStatus.NoContent);
    } catch (e) {
      errorsHandler(e, res);
    }
  }
}
