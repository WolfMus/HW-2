import { inject, injectable } from "inversify";
import { LikeStatus } from "../../comments/types/likeComments.enum";
import { LikesInfo } from "../../comments/types/like-status.type";
import { LikesRepository } from "../repository/likes.repository";
import { BadRequestError } from "../../core/errors/bad-request.error";
import { LikesQwRepository } from "../repository/likes-query.repository";

@injectable()
export class LikesService {
    constructor(
        @inject(LikesRepository) protected likesRepo: LikesRepository,
        @inject(LikesQwRepository) protected likesQueryRepo: LikesQwRepository,
    ){}

    async setStatus(commentId: string, userId: string, likeStatus: LikeStatus): Promise<void> {
        const statusBody: LikesInfo = {
            commentId: commentId,
            userId: userId,
            likeStatus: likeStatus,
        };

        await this.likesRepo.create(statusBody);
        return;
    }

    async isValidStatus(status: string): Promise<LikeStatus> {
        const isValid = Object.values(LikeStatus).includes(status as LikeStatus);
        if (isValid) {
            return status as LikeStatus;
        } else {
            throw new BadRequestError("Bad Request", "likeStatus");
        }
    }

    async previousStatus(commentId: string, userId: string): Promise<LikeStatus | null> {
        return await this.likesQueryRepo.findStatus(commentId, userId)
    }

    async removeStatus(commentId: string, userId: string): Promise<void> {
        return await this.likesRepo.removeStatus(commentId, userId)
    }
}