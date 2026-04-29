import { LikeStatus } from "./likeComments.enum";

export type LikesInfo = {
    commentId: string,
    userId: string,
    status: LikeStatus,
}