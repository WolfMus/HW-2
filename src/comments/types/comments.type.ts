import { LikeStatus } from "../../likes/types/likeComments.enum";
import { CommentatorInfo } from "./commentUserInfo";

export type likesInfoForComms = {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
}

export type Comment = {
  content: string;
  postId: string;
  commentatorInfo: CommentatorInfo;
  createdAt: Date;
  likesInfo: likesInfoForComms;
};
