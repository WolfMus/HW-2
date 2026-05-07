import { injectable } from "inversify";
import { LikesForPostDocument, LikesForPostModel } from "../models/like-posts.model";

@injectable()
export class LikesForPostsRepository {
    constructor(){}
    
    async save(like: LikesForPostDocument): Promise<void> {
        like.save();
        return;
    }

    async delete(likeId: string): Promise<void> {
        await LikesForPostModel.findByIdAndDelete(likeId);
        return;
    }
}