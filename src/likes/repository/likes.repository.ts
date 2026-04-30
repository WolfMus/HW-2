import { injectable } from "inversify";
import { LikeForCommentModel } from "../models/likeComments.schema";
import { LikesInfo } from "../../comments/types/like-status.type";

@injectable()
export class LikesRepository {
    costructor(){}
    async create(likesBody: LikesInfo): Promise<string> {
        const created = await LikeForCommentModel.insertOne(likesBody);
        return created._id.toString();
    }
    async removeStatus(commentId: string, userId: string): Promise<void> {
        const deleted = await LikeForCommentModel.deleteOne({
            commentId, userId
        })
        console.log(deleted)
        if (deleted.deletedCount < 1) {
            throw new Error("Да не могла эта ошибка появиться...")
        }
        return;
    }
}