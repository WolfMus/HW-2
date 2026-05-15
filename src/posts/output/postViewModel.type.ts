import { LikeStatus } from "../../likes/types/likeComments.enum"

export type PostLikeViewModel = {
    userId: string,
    likeStatus: LikeStatus,
    addedAt: Date,
}