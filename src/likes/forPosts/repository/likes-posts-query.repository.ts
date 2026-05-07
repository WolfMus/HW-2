import { injectable } from "inversify";
import { LikesForPostDocument, LikesForPostModel } from "../models/like-posts.model";

@injectable()
export class LikesForPostsQwRepository {
    constructor(){}

    async findByPostAndUserId(postId: string, userId: string): Promise<LikesForPostDocument | null> {
        const like = await LikesForPostModel.findOne({postId: postId, userid: userId})
        if (!like) {
            return null
        }
        return like
    }
}