import { Token } from "../types/tokens.types"
import { tokensCollection } from "../../db/mongo.db"
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error"
import { UUID } from "crypto"

export const tokenRepository = {
    async create(refreshToken: Token): Promise<string> {
        await tokensCollection.insertOne(refreshToken);
        return refreshToken.tokenId;
    },

    async delete(token: UUID): Promise<void> {
        const deleted = await tokensCollection.deleteOne({tokenId: token});

        if (deleted.deletedCount < 1) {
            throw new RepositoryNotFoundError("TokenId not found", "refresh token")
        }
        
        return;
    }
} 