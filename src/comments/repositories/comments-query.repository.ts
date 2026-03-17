import { commentsCollection } from "../../db/mongo.db";
import { CommentDbViewModel } from "../types/commentViewModel";

export const commentsRepository = {
    async create(newComment: CommentDbViewModel): Promise<string> {
        const insertResult = await commentsCollection.insertOne(newComment)

        return insertResult.insertedId.toString();
    }
}