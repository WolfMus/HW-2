import { injectable } from "inversify";
import { LikeForCommentModel } from "../models/like-comments.schema";
import { LikeStatus } from "../../../comments/types/likeComments.enum";

@injectable()
export class LikesForCommsQwRepository {
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

  async findMany(commentsInfo: string[], userId: string): Promise<[string, string][]> {
    const reactions = await LikeForCommentModel.find({
      commentId: commentsInfo,
      userId: userId,
    })
    return reactions.map(i => [i.commentId, i.likeStatus])
  }
}
