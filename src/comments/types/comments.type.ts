import { CommentatorInfo } from "./commentUserInfo";

export type likesInfoForComms = {
  likesCount: number;
  dislikesCount: number;
  myStatus: string;
}

export type Comment = {
  content: string;
  postId: string;
  commentatorInfo: CommentatorInfo;
  createdAt: Date;
  likesInfo: likesInfoForComms;
};
