import { injectable } from "inversify";
import { LikeForCommentModel } from "../models/likeComments.schema";
import { LikesInfo } from "../../comments/types/like-status.type";

@injectable()
export class LikesRepository {
    costructor(){}
    async create(likesBody: LikesInfo): Promise<void> {
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