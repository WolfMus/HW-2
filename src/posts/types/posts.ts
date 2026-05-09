import { LikeStatus } from "../../likes/types/likeComments.enum";

export type Post = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatus;
    newestLikes: [
      addedAt: Date, 
      userId: string, 
      login: string
    ];
  };
};
