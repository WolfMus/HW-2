import jwt from "jsonwebtoken";
import { SETTINGS } from "../../core/settings/settings";
import { add } from "date-fns";
import { Token } from "../types/tokens.types";
import { tokenRepository } from "../repositories/token.repository";
import { TokenDbView } from "../types/token-db-view.type";
import { tokenQwRepository } from "../repositories/token-query.repository";

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

  async createRefreshToken(id: string): Promise<string> {
    const refreshToken = await this.createToken(id);

    const tokenBody: Token = {
      refreshToken: refreshToken,
      userId: id,
      createdAt: new Date(),
      expiredAt: add(new Date(), { seconds: 20 }),
    };

    const tokenId = await tokenRepository.create(tokenBody);
    return tokenId;
  },

  async findRefreshToken(id: string): Promise<TokenDbView> {
    const refreshToken = await tokenQwRepository.findById(id);
    return refreshToken;
  },
};
