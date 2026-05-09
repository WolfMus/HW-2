import "reflect-metadata";
import { inject, injectable } from "inversify";
import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";
import { UsersRepository } from "../../users/repository/users.repository";
import { UsersQwRepository } from "../../users/repository/usersQw.repository";
import { add } from "date-fns";
import { BadRequestError } from "../../core/errors/bad-request.error";
import { BcryptService } from "../../core/heplers/bcrypt-service";
import { UnauthorizedError } from "../../core/errors/unauthorizedError.error";
import { JwtService } from "./jwtService";
import { SecurityDeviceService } from "../../security/application/securityDevice.service";
import { NodeMailerService } from "./nodeMailerService";
import { RecoveryCodeRepository } from "../repositories/recovery-code.repository";

@injectable()
export class AuthService {
  constructor(
    @inject(UsersRepository) protected usersRepo: UsersRepository,
    @inject(UsersQwRepository) protected usersQueryRepo: UsersQwRepository,
    @inject(BcryptService) protected cryptoService: BcryptService,
    @inject(JwtService) protected jwtService: JwtService,
    @inject(SecurityDeviceService) protected securityService: SecurityDeviceService,
    @inject(NodeMailerService) protected emailService: NodeMailerService,
    @inject(RecoveryCodeRepository) protected recoveryCodeRepo: RecoveryCodeRepository
  ) {}

  async login(
    loginOrEmail: string,
    password: string,
    ip: string,
    title: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    refreshTokenBody: jwt.JwtPayload;
  }> {
    // Поис
    const user = await this.usersQueryRepo.findLoginOrEmail(loginOrEmail);
    const ispasswordCorrect = await this.cryptoService.checkPassword(
      password,
      user.hash,
    );

    if (!ispasswordCorrect) {
      throw new UnauthorizedError("Incorrect password", "password");
    }

    // Создание токенов
    const accessToken = await this.jwtService.createToken(user.id);
    const refreshToken = await this.jwtService.createRefreshToken(user.id);
    const refreshTokenBody = await this.jwtService.decodeToken(refreshToken);

    await this.securityService.add(
      user.id,
      refreshTokenBody.deviceId,
      title,
      ip,
      new Date(refreshTokenBody.iat! * 1000),
    );

    return { accessToken, refreshToken, refreshTokenBody };
  }

  async checkConfirmationCode(code: string): Promise<void> {
    const userConfirmation =
      await this.usersQueryRepo.findByConfirmationCode(code);

    if (userConfirmation!.emailConfirmation.expirationCode < new Date()) {
      throw new BadRequestError("CONFIRMATION CODE EXPIRED", "code");
    }

    if (userConfirmation?.emailConfirmation.isConfirmed === true) {
      throw new BadRequestError(
        "Confirmation code is already confirmed",
        "code",
      );
    }

    const user = await this.usersQueryRepo.findLoginOrEmail(
      userConfirmation!.login,
    );

    await this.usersRepo.updateConfirmation(user!._id.toString());
    return;
  }

  async updateConfirmationCodeForUser(id: string): Promise<string> {
    const confirmationCode = randomUUID();
    const expiration = add(new Date(), {
      minutes: 5,
    });
    await this.usersRepo.updateConfirmationCode(
      id,
      confirmationCode,
      expiration,
    );
    return confirmationCode;
  }

  async isConfirmed(id: string): Promise<void> {
    const user = await this.usersQueryRepo.findByIdInDbView(id);
    if (user.emailConfirmation.isConfirmed === true) {
      throw new BadRequestError("User already confirmed", "email");
    }

    return;
  }

  async passwordRecovery(email: string): Promise<void> {
    const recoveryCode = randomUUID();
    const recoveryCodeExpDate = add(new Date(), {minutes: 15});

    await this.recoveryCodeRepo.create(recoveryCode, recoveryCodeExpDate, email);
    await this.emailService.sendRecoveryCode(email, recoveryCode);
    return;
  }

  // RecoveyCodeRepo поменять
  async updatePassword(recoveryCode: string, password: string): Promise<{hash: string, salt: string, recoveryCodeEmail: string}> {
    const recoveryCodeEmail = await this.recoveryCodeRepo.find(recoveryCode);
    const {hash, salt} = await this.cryptoService.generateHash(password);
    return {hash, salt, recoveryCodeEmail};
  }
}
