import { injectable } from "inversify";
import { LikesForPostDocument } from "../models/like-posts.model";

@injectable()
export class LikesForPostsRepository {
    constructor(){}
    
    async save(like: LikesForPostDocument): Promise<void> {
        await like.save();
        return;
    }

    async delete(){}
}