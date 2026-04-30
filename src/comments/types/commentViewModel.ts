import { likesInfoForComms } from "./comments.type";
import { CommentatorInfo } from "./commentUserInfo";

export type CommentViewModel = {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfo;
  createdAt: Date;
  likesInfo: likesInfoForComms,
};
