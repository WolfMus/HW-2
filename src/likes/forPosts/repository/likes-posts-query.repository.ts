import { injectable } from "inversify";
import {
  LikesForPostDocument,
  LikesForPostModel,
} from "../models/like-posts.model";
import { LikeStatus } from "../../types/likeComments.enum";

@injectable()
export class LikesForPostsQwRepository {
  constructor() {}

  async findByPostAndUserId(
    postId: string,
    userId: string,
  ): Promise<LikesForPostDocument | null> {
    const like = await LikesForPostModel.findOne({ postId, userId });
    if (!like) {
      return null;
    }
    return like;
  }

  async findStatusesForList(
    postIds: string[],
    userId: string,
  ): Promise<{postId: string, likeStatus: LikeStatus}[]> {
    const likeStatuses = await LikesForPostModel.find({
      postId: {$in: postIds},
      userId: userId,
    }, {
      _id: 0,
      postId: 1,
      likeStatus: 1,
    }).lean();

    return likeStatuses;
  }

  async findNewestLikes(postId: string): Promise<LikesForPostDocument[]> {
    const likes: LikesForPostDocument[] = await LikesForPostModel.find({
      postId: postId,
      likeStatus: LikeStatus.Like,
    })
      .sort({ addedAt: -1 })
      .limit(3);
    return likes;
  }

  async findNewestLikesForList(
    postIds: string[],
  ): Promise<{ _id: string; recentLikes: LikesForPostDocument[] }[]> {

    const likes: { _id: string; recentLikes: LikesForPostDocument[] }[] =
      await LikesForPostModel.aggregate([
        { $match: { 
          postId: { $in: postIds },
          likeStatus: LikeStatus.Like,
        } },
        {
          $group: {
            _id: "$postId",
            recentLikes: {
              $topN: {
                n: 3,
                sortBy: { addedAt: -1 },
                output: {
                    addedAt: "$addedAt", 
                    userId: "$userId", 
                    login: "$login" 
                },
              },
            },
          },
        },
      ]);
    return likes;
  }
}
