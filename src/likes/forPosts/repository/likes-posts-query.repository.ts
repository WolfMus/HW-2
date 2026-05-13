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

  async findNewestLikes(postId: string): Promise<LikesForPostDocument[]> {
    const likes: LikesForPostDocument[] = await LikesForPostModel.find({
      postId: postId,
      likeStatus: LikeStatus.Like,
    })
      .sort({ addedAt: -1 })
      .limit(3);
    return likes;
  }

  async findNewestLikesForPosts(
    postIds: string[],
  ): Promise<{ _id: string; recentLikes: LikesForPostDocument[] }[]> {
    const likes: { _id: string; recentLikes: LikesForPostDocument[] }[] =
      await LikesForPostModel.aggregate([
        { $match: { postId: { $in: postIds } } },
        {
          $group: {
            _id: "$postId",
            recentLikes: {
              $topN: {
                n: 3,
                sortBy: { createdAt: -1 },
                output: {
                    addedAt: "$addedAt", 
                    userId: "$userId", 
                    likeStatus: "$likeStatus" 
                },
              },
            },
          },
        },
      ]);
      likes.forEach(f => {console.log(f.recentLikes)})
    return likes;
  }
}
