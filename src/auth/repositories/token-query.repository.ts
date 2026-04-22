import { tokensCollection } from "../../db/mongo.db";
import { WithId } from "mongodb";
import { Token } from "../types/tokens.types";
import { TokenDbView } from "../types/token-db-view.type";
import { UnauthorizedError } from "../../core/errors/unauthorizedError.error";

export class TokenQwRepository {
  async findById(refreshToken: string): Promise<TokenDbView> {
    const token = await tokensCollection.findOne({ refreshToken: refreshToken });
    if (!token) {
      throw new UnauthorizedError("Token id not found", "id");
    }
    return this._toDbViewModel(token);
  }

  _toDbViewModel(token: WithId<Token>): TokenDbView {
    return {
      id: token._id.toString(),
      userId: token.userId,
      refreshToken: token.refreshToken,
      createdAt: token.createdAt,
      expiresAt: token.expiresAt,
    };
  }
};
