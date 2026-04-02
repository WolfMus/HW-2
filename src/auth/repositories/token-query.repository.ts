import { tokensCollection } from "../../db/mongo.db"
import { ObjectId, WithId } from "mongodb"
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error"
import { Token } from "../types/tokens.types"
import { TokenDbView } from "../types/token-db-view.type"

export const tokenQwRepository = {
    async findById(id: string): Promise<TokenDbView> {
        const token = await tokensCollection.findOne({_id: new ObjectId(id)})
        if (!token) {
            throw new RepositoryNotFoundError("Token id not found", "id")
        }
        return this._toDbViewModel(token)
    },

    _toDbViewModel(token: WithId<Token>): TokenDbView {
        return {
            id: token._id.toString(),
            refreshToken: token.refreshToken,
            userId: token.userId,
            createdAt: token.createdAt,
            expiredAt: token.expiredAt,
        }
    },
}