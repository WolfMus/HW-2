import { LikeStatus } from "./likeComments.enum";

export type LikesInfo = {
    commentId: string,
    userId: string,
    likeStatus: LikeStatus,
}