import { injectable } from "inversify";
import { LikeForCommentModel } from "../models/likeComments.schema";
import { LikeStatus } from "../../comments/types/likeComments.enum";

@injectable()
export class LikesQwRepository {
  async findStatus(commentId: string, userId: string): Promise<LikeStatus | null> {
    const status = await LikeForCommentModel.findOne({
      commentId: commentId,
      userId: userId,
    });

    if (!status) {
        return null
    }

    return status.likeStatus
  }

  async getStatus(commentId: string, userId: string): Promise<LikeStatus | null> {
    const like = await LikeForCommentModel.findOne({
      commentId: commentId,
      userId: userId,
    });

    if (!like) {
      return null
    }

    return like.likeStatus
  }
}
