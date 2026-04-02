import { Token } from "../types/tokens.types"
import { tokensCollection } from "../../db/mongo.db"

export const tokenRepository = {
    async create(tokenBody: Token): Promise<string> {
        const token = await tokensCollection.insertOne(tokenBody)
        return token.insertedId.toString()
    }
} 