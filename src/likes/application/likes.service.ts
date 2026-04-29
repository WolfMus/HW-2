import { inject, injectable } from "inversify";
import { LikeStatus } from "../../comments/types/likeComments.enum";
import { LikesInfo } from "../../comments/types/like-status.type";
import { LikesRepository } from "../repository/likes.repository";

@injectable()
export class LikesService {
    constructor(
        @inject(LikesRepository) protected likesRepo: LikesRepository,
    ){

    }

    async setStatus(commentId: string, userId: string, likeStatus: LikeStatus): Promise<string> {
        const statusBody: LikesInfo = {
            commentId: commentId,
            userId: userId,
            status: likeStatus,
        };

        const likeId = await this.likesRepo.create(statusBody);
        return likeId;
    }
}