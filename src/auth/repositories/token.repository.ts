import { Token } from "../types/tokens.types";
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";
import { injectable } from "inversify";
import { tokensModel } from "../models/token.Schema";

@injectable()
export class TokenRepository {
  async create(refreshToken: Token): Promise<void> {
    await tokensModel.insertOne(refreshToken);
    return;
  }

  async delete(refreshToken: string): Promise<void> {
    const deleted = await tokensModel.deleteOne({
      refreshToken: refreshToken,
    });

    if (deleted.deletedCount < 1) {
      throw new RepositoryNotFoundError("TokenId not found", "refresh token");
    }

    return;
  }
}
