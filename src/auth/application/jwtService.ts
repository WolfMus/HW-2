import jwt from "jsonwebtoken";
import { SETTINGS } from "../../core/settings/settings";
import { add } from "date-fns";
import { tokenRepository } from "../repositories/token.repository";
import { TokenDbView } from "../types/token-db-view.type";
import { tokenQwRepository } from "../repositories/token-query.repository";
import { randomUUID } from "crypto";
import { RefreshToken } from "../types/token-refresh.type";
import { blackListRepository } from "../repositories/black-list.repository";

export const jwtService = {
  async createToken(userId: string): Promise<string> {
    const token = jwt.sign(
      {
        userId,
      },
      SETTINGS.JWT_SECRET,
      { expiresIn: "10s" },
    );
    return token;
  },

  async decodeToken(token: string): Promise<string> {
    const decodedToken = jwt.decode(token);
    return decodedToken!.toString();
  },

  async verifyToken(token: string): Promise<{ userId: string } | null> {
    try {
      return jwt.verify(token, SETTINGS.JWT_SECRET) as { userId: string };
    } catch (error) {
      console.error("Token verify catch some error", error);
      return null;
    }
  },

  async verifyRefreshToken(token: string): Promise<RefreshToken | null> {
    try {
      return jwt.verify(token, SETTINGS.JWT_SECRET) as RefreshToken;
    } catch (error) {
      console.error("Refresh token verify catch some error", error);
      return null;
    }
  },

  async createRefreshToken(userId: string): Promise<string> {
    const jit = randomUUID();
    const createdAt = new Date();
    const expiresAt = add(new Date(), { seconds: 20 });
    const refreshToken = jwt.sign({
      jit: jit,
      sub: userId,
      iat: createdAt.getTime(),
      exp: expiresAt.getTime(),
    }, SETTINGS.JWT_SECRET);

    const tokenBody = {
      tokenId: jit,
      userId: userId,
      refreshToken: refreshToken,
      createdAt: createdAt,
      expiresAt: expiresAt,
    }

    const tokenId = await tokenRepository.create(tokenBody);
    return tokenId;
  },

  async findRefreshTokenById(tokenId: string): Promise<TokenDbView> {
    const refreshToken = await tokenQwRepository.findById(tokenId);
    return refreshToken;
  },

  async addToBlackList(refreshToken: string): Promise<void> {
    const payload = await this.verifyRefreshToken(refreshToken);

    const blackListId = await blackListRepository.create(refreshToken);
    if (!blackListId) {
      throw new Error("Token was not added in black list");
    }
    await tokenRepository.delete(payload!.jit);
    return;
  },

  async isBlocked(refreshToken: string): Promise<boolean> {
    const isBlocked = await blackListRepository.find(refreshToken);
    return isBlocked;
  }

};
