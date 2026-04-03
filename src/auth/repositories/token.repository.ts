import { Token } from "../types/tokens.types"
import { tokensCollection } from "../../db/mongo.db"
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error"
import { ObjectId } from "mongodb"

export const tokenRepository = {
    async create(tokenBody: Token): Promise<string> {
        const token = await tokensCollection.insertOne(tokenBody)
        return token.insertedId.toString()
    },

    async update(tokenBody: Token, id: string): Promise<void> {
        const updated = await tokensCollection.updateOne({_id: new ObjectId(id)}, {$set: {
            refreshToken: tokenBody.refreshToken,
            createdAt: tokenBody.createdAt,
            expiredAt: tokenBody.expiredAt,
        }});
        if (updated.matchedCount < 1) {
            throw new RepositoryNotFoundError("Token is not found", "token");
        }
        return;
    }
} 