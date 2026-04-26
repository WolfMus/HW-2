import { Response } from "express";
import { errorsHandler } from "../../core/errors/errors.handler";
import { IdType } from "../../core/types/id";
import {
  RequestWithUserId,
  HttpStatus,
  RequestWithParamsAndUserId,
} from "../../core/types/types";
import { SecurityDeviceService } from "../application/securityDevice.service";
import { JwtService } from "../../auth/application/jwtService";
import { inject, injectable } from "inversify";

@injectable()
export class SecurityController {

  constructor(
    @inject(SecurityDeviceService) protected securityService: SecurityDeviceService, 
    @inject(JwtService) protected jwtService: JwtService
  ) {}

  async getDevicesList(req: RequestWithUserId<IdType>, res: Response) {
    try {
      const userId = req.user.id;
      const listOfDevices = await this.securityService.findMany(userId);
      res.status(HttpStatus.Ok).send(listOfDevices);
    } catch (e) {
      errorsHandler(e, res);
    }
  }

  async deleteAllDevices(req: RequestWithUserId<IdType>, res: Response) {
    try {
      const userId = req.user.id;
      const refreshToken = await this.jwtService.verifyRefreshToken(
        req.cookies.refreshToken,
      );

      await this.securityService.deleteMany(userId, refreshToken!.deviceId);

      res.sendStatus(HttpStatus.NoContent);
    } catch (e) {
      errorsHandler(e, res);
    }
  }

  async deleteOneDevice(
    req: RequestWithParamsAndUserId<{ deviceId: string }, IdType>,
    res: Response,
  ) {
    try {
      const deviceId = req.params.deviceId;
      const userId = req.user.id;

      // ПРОВЕРКА НА ДРУГОГО ЮЗЕРА
      const userId_2 = await this.securityService.findUserId(deviceId);

      if (userId_2 === userId) {
        await this.securityService.deleteOne(userId, deviceId);
        res.sendStatus(HttpStatus.NoContent);
      } else {
        res.sendStatus(HttpStatus.Forbidden);
      }
    } catch (e) {
      errorsHandler(e, res);
    }
  }
}
