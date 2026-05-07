import { injectable } from "inversify";
import { LikesForPostDocument, LikesForPostModel } from "../models/like-posts.model";

@injectable()
export class LikesForPostsQwRepository {
    constructor(){}

    async findByPostAndUserId(postId: string, userId: string): Promise<LikesForPostDocument | null> {
        const like = await LikesForPostModel.findOne({postId, userId})
        if (!like) {
            return null
        }
        return like
    }

    async findNewestLikes(postId: string): Promise<LikesForPostDocument[]> {
        const likes: LikesForPostDocument[] = await LikesForPostModel
            .find({postId: postId})
            .sort({addedAt: -1})
            .limit(3);
        return likes
    }
}