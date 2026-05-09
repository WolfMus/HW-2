import mongoose, { HydratedDocument, Model, model } from "mongoose";
import { LikeStatus } from "../../types/likeComments.enum";

export type LikesForPost = {
    postId: string,
    userId: string,
    login: string,
    likeStatus: LikeStatus,
    addedAt: Date,
};

interface LikesForPostMethods {
    updateStatus(dto: string): void,
}

type LikesForPostStatics = typeof LikesForPostEntity;
type LikesForPostModel = Model<LikesForPost, unknown, LikesForPostMethods> & LikesForPostStatics;
export type LikesForPostDocument = HydratedDocument<LikesForPost, LikesForPostMethods>;

const likesForPostsSchema = new mongoose.Schema<LikesForPost, LikesForPostModel, LikesForPostMethods>({
    postId: {type: String, required: true},
    userId: {type: String, required: true},
    login: {type: String, required: false},
    likeStatus: {type: String, required: true},
    addedAt: {type: Date, required: true},
})

class LikesForPostEntity {
  private constructor(
    public postId: string,
    public userId: string,
    public login: string,
    public likeStatus: LikeStatus,
    public addedAt: Date,
  ) {}

  static createLike(likeStatus: string, postId: string, userId: string, login: string) {
    const like = new LikesForPostModel({
      postId: postId,
      userId: userId,
      login: login,
      likeStatus: likeStatus as LikeStatus,
      addedAt: new Date(),
    }) as LikesForPostDocument;

    return like
  };

  async updateStatus(status: string) {
    this.likeStatus = status as LikeStatus;
    this.addedAt = new Date();
    return
  };
}

likesForPostsSchema.loadClass(LikesForPostEntity);

export const LikesForPostModel = model<LikesForPost, LikesForPostModel>("Likes for posts", likesForPostsSchema);