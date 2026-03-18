import { commentsCollection } from "../../db/mongo.db";
import { Comment } from "../types/comments";

export const commentsRepository = {
    async create(newComment: Comment): Promise<string> {
        const insertResult = await commentsCollection.insertOne(newComment)

        return insertResult.insertedId.toString();
    }
}