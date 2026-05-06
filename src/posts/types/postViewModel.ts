import { LikeStatus } from "../../comments/types/likeComments.enum";

export type PostViewModel = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date | null;
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
