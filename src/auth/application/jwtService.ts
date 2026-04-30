import jwt from "jsonwebtoken";
import { SETTINGS } from "../../core/settings/settings";
import { TokenRepository } from "../repositories/token.repository";
import { TokenDbView } from "../types/token-db-view.type";
import { TokenQwRepository } from "../repositories/token-query.repository";
import { randomUUID } from "crypto";
import { RefreshToken } from "../types/token-refresh.type";
import { add } from "date-fns";
import { Token } from "../types/tokens.types";
import { inject, injectable } from "inversify";

@injectable()
export class JwtService {
  constructor(
    @inject(TokenRepository) protected tokenRepo: TokenRepository,
    @inject(TokenQwRepository) protected tokenQueryRepo: TokenQwRepository
  ) {}

  async createToken(userId: string): Promise<string> {
    const iat = new Date();
    const exp = add(iat, { minutes: 10 });
    const token = jwt.sign(
      {
        userId,
        exp: Math.floor(exp.getTime() / 1000),
      },
      SETTINGS.JWT_SECRET,
    );
    return token;
  }

  async decodeToken(token: string): Promise<jwt.JwtPayload> {
    const decodedToken = jwt.decode(token);
    return decodedToken as jwt.JwtPayload;
  }

  async verifyToken(token: string): Promise<{ userId: string } | null> {
    try {
      return jwt.verify(token, SETTINGS.JWT_SECRET) as { userId: string };
    } catch (error) {
      console.error("Token verify catch some error:", error);
      return null;
    }
  }

  async verifyRefreshToken(token: string): Promise<RefreshToken | null> {
    try {
      return jwt.verify(token, SETTINGS.JWT_SECRET) as RefreshToken;
    } catch (error) {
      console.error("Refresh token verify catch some error:", error);
      return null;
    }
  }

  async createRefreshToken(userId: string): Promise<string> {
    const deviceId = randomUUID();
    const createdAt = new Date();
    const expiresAt = add(createdAt, { seconds: 20 });

    const refreshToken = jwt.sign(
      {
        sub: userId,
        deviceId: deviceId,
        exp: Math.floor(expiresAt.getTime() / 1000),
      },
      SETTINGS.JWT_SECRET,
    );

    const tokenBody: Token = {
      userId: userId,
      refreshToken: refreshToken,
      createdAt: createdAt,
      expiresAt: expiresAt,
    };

    // console.log("Refresh Token Created at: ", createdAt);
    // console.log("Device id after log in: ", deviceId);

    await this.tokenRepo.create(tokenBody);

    return refreshToken;
  }

  async updateRefreshToken(userId: string, deviceId: string): Promise<string> {
    const createdAt = new Date();
    const expiresAt = add(createdAt, { seconds: 20 });

    // console.log("New refresh token created at: ", createdAt);
    // console.log("Device id after updating refresh token: ", deviceId);

    const refreshToken = jwt.sign(
      {
        sub: userId,
        deviceId: deviceId,
        exp: Math.floor(expiresAt.getTime() / 1000),
      },
      SETTINGS.JWT_SECRET,
    );

    const tokenBody: Token = {
      userId: userId,
      refreshToken: refreshToken,
      createdAt: createdAt,
      expiresAt: expiresAt,
    };

    await this.tokenRepo.create(tokenBody);
    return refreshToken;
  }

  async findRefreshTokenById(tokenId: string): Promise<TokenDbView> {
    const refreshToken = await this.tokenQueryRepo.findById(tokenId);
    return refreshToken;
  }

  async deleteRefreshToken(refreshToken: string): Promise<void> {
    await this.tokenRepo.delete(refreshToken);
    return;
  }
}
