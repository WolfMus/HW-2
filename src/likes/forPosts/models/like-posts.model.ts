import mongoose, { HydratedDocument, Model, model } from "mongoose";
import { LikeStatus } from "../../../comments/types/likeComments.enum";

export type LikesForPost = {
    postId: string,
    userId: string,
    likeStatus: LikeStatus,
    addedAt: Date,
};

interface LikesForPostMethods {
    updateStatus(dto: string): LikesForPostDocument,
}

type LikesForPostStatics = typeof LikesForPostEntity;
type LikesForPostModel = Model<LikesForPost, unknown, LikesForPostMethods> & LikesForPostStatics;
export type LikesForPostDocument = HydratedDocument<LikesForPost, LikesForPostMethods>;

const likesForPostsSchema = new mongoose.Schema<LikesForPost, LikesForPostModel, LikesForPostMethods>({
    postId: {type: String, required: true},
    userId: {type: String, required: true},
    likeStatus: {type: String, required: true},
    addedAt: {type: Date, required: true},
})

class LikesForPostEntity {
  private constructor(
    public postId: string,
    public userId: string,
    public likeStatus: LikeStatus,
    public addedAt: Date,
  ) {}

  static createLike(likeStatus: string, postId: string, userId: string) {
    const like = new LikesForPostModel({
      postId: postId,
      userId: userId,
      likeStatus: likeStatus as LikeStatus,
      addedAt: new Date(),
    }) as LikesForPostDocument;

    return like
  };

  async updateStatus(status: string) {
    this.likeStatus = status as LikeStatus;
    this.addedAt = new Date();
    return this
  };
}

likesForPostsSchema.loadClass(LikesForPostEntity);

export const LikesForPostModel = model<LikesForPost, LikesForPostModel>("Likes for posts", likesForPostsSchema);