import mongoose, { model } from "mongoose";
import { LikeStatus } from "../../../comments/types/likeComments.enum";

export type LikesForComms = {
    commentId: string,
    userId: string,
    likeStatus: LikeStatus,
}

const likeForCommentsSchema = new mongoose.Schema<LikesForComms>({
    commentId: {type: String, required: true},
    userId: {type: String, required: true},
    likeStatus: {type: String, required: true},
})

export const LikeForCommentModel = model("Likes for comms", likeForCommentsSchema);