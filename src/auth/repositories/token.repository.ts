import { Token } from "../types/tokens.types";
import { tokensCollection } from "../../db/mongo.db";
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";
import { injectable } from "inversify";

@injectable()
export class TokenRepository {
  async create(refreshToken: Token): Promise<void> {
    await tokensCollection.insertOne(refreshToken);
    return;
  }

  async delete(refreshToken: string): Promise<void> {
    const deleted = await tokensCollection.deleteOne({
      refreshToken: refreshToken,
    });

    if (deleted.deletedCount < 1) {
      throw new RepositoryNotFoundError("TokenId not found", "refresh token");
    }

    return;
  }
}
