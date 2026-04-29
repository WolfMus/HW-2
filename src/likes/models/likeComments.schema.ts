import mongoose, { model } from "mongoose";
import { LikesInfo } from "../../comments/types/like-status.type";

const likeForCommentsSchema = new mongoose.Schema<LikesInfo>({
    commentId: {type: String, required: true},
    userId: {type: String, required: true},
    status: {type: String, required: false},
})

export const LikeForCommentModel = model("Likes", likeForCommentsSchema);