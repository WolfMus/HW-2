import { injectable } from "inversify";
import { LikeForCommentModel, LikesForComms } from "../models/like-comments.schema";

@injectable()
export class LikesForCommsRepository {
    costructor(){}
    async create(likesBody: LikesForComms): Promise<void> {
        await LikeForCommentModel.insertOne(likesBody);
        return;
    }
    async removeStatus(commentId: string, userId: string): Promise<void> {
        const deleted = await LikeForCommentModel.deleteOne({
            commentId, userId
        })
        if (deleted.deletedCount < 1) {
            throw new Error("Да не могла эта ошибка появиться...")
        }
        return;
    }
}