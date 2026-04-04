import { tokensCollection } from "../../db/mongo.db";
import { WithId } from "mongodb";
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";
import { Token } from "../types/tokens.types";
import { TokenDbView } from "../types/token-db-view.type";

export const tokenQwRepository = {
  async findById(tokenId: string): Promise<TokenDbView> {
    const token = await tokensCollection.findOne({ tokenId: tokenId });
    if (!token) {
      throw new RepositoryNotFoundError("Token id not found", "id");
    }
    return this._toDbViewModel(token);
  },

  _toDbViewModel(token: WithId<Token>): TokenDbView {
    return {
      id: token._id.toString(),
      tokenId: token.tokenId,
      userId: token.userId,
      refreshToken: token.refreshToken,
      expiresAt: token.expiresAt,
      createdAt: token.createdAt,
    };
  },
};
