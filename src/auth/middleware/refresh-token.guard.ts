import { NextFunction, Request, Response } from "express";
import { jwtService, securityService, tokenRepo } from "../../composition-root";
import { errorsHandler } from "../../core/errors/errors.handler";
import { IdType } from "../../core/types/id";
import { UnauthorizedError } from "../../core/errors/unauthorizedError.error";

export const refreshTokenGuard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedError("Refresh token is not valid", "refreshToken");
    }

    const payload = await jwtService.verifyRefreshToken(refreshToken);
    if (!payload) {
      throw new UnauthorizedError("Refresh token is not valid", "refreshToken");
    }

    const refreshTokenBody =
      await jwtService.findRefreshTokenById(refreshToken);
    if (!refreshTokenBody) {
      throw new UnauthorizedError("Refresh token is not valid", "refreshToken");
    }

    const dateNow = new Date();
    if (refreshTokenBody.expiresAt <= dateNow) {
      await tokenRepo.delete(refreshToken);
      throw new UnauthorizedError("Refresh token is not valid", "refreshToken");
    }

    // Проверка существует ли сессия
    const session = await securityService.findByUserAndDeviceId(
      payload.sub,
      payload.deviceId,
    );
    if (!session) {
      throw new UnauthorizedError("Refresh token is not valid", "refreshToken");
    }

    const userId = payload.sub;

    req.user = { id: userId } as IdType;

    next();
  } catch (e) {
    errorsHandler(e, res);
    return;
  }
};
