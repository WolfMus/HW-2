import mongoose, { HydratedDocument, Model, model } from "mongoose";
import { Comment, likesInfoForComms } from "../types/comments.type";
import { CommentatorInfo } from "../types/commentUserInfo";
import { LikeStatus } from "../../likes/types/likeComments.enum";

interface CommentsMethods {}

type CommentsStatics = typeof CommentsEntity;
type CommentsModel = Model<Comment, unknown, CommentsMethods> & CommentsStatics;
export type CommentsDocument = HydratedDocument<Comment, CommentsMethods>;

const commentatorInfoSchema = new mongoose.Schema<CommentatorInfo>({
  userId: { type: String, required: true },
  userLogin: { type: String, required: true },
});

const likesInfoSchema = new mongoose.Schema<likesInfoForComms>({
  likesCount: { type: Number, required: true, default: 0 },
  dislikesCount: { type: Number, required: true, default: 0 },
  myStatus: { type: String, enum: Object.values(LikeStatus), required: true, default: LikeStatus.None },
});

const commentsSchema = new mongoose.Schema<Comment>({
  content: { type: String, required: true },
  postId: { type: String, required: true },
  commentatorInfo: commentatorInfoSchema,
  createdAt: { type: Date, required: true },
  likesInfo: likesInfoSchema,
});

class CommentsEntity {
  private constructor(
    public content: string,
    public postId: string,
    public commentatorInfo: {
      userId: string,
      userLogin: string,
    },
    public createdAt: Date,
    public likesInfo: {
      likesCount: number,
      dislikesCount: number,
      myStatus: string,
    }
  ) {}

  static createComment(dto: Comment) {
    const comment = new commentsModel({
      ...dto
    });
    return comment
  }
}

commentsSchema.loadClass(CommentsEntity);
export const commentsModel = model<Comment, CommentsModel>("Comments", commentsSchema);