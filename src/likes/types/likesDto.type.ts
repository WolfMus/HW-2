import { LikeStatus } from "../../comments/types/likeComments.enum";

export type CreateLikeDto = {
    likeStatus: LikeStatus,
}