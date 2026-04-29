import { injectable } from "inversify";
import { LikeForCommentModel } from "../models/likeComments.schema";
import { LikesInfo } from "../../comments/types/like-status.type";

@injectable()
export class LikesRepository {
    costructor(){}
    async create(likesBody: LikesInfo): Promise<string> {
        const created = await LikeForCommentModel.insertOne(likesBody);
        return created._id.toString();
    }
}