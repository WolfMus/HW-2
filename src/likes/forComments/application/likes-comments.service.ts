import { inject, injectable } from "inversify";
import { LikesForCommsRepository } from "../repository/likes-comms.repository";
import { LikesForCommsQwRepository } from "../repository/likes-comms-query.repository";
import { LikeStatus } from "../../../comments/types/likeComments.enum";
import { BadRequestError } from "../../../core/errors/bad-request.error";
import { LikesForComms } from "../models/like-comments.schema";

@injectable()
export class LikesForCommsService {
    constructor(
        @inject(LikesForCommsRepository) protected likesCommsRepo: LikesForCommsRepository,
        @inject(LikesForCommsQwRepository) protected likesCommsQueryRepo: LikesForCommsQwRepository,
    ){}

    async setStatus(commentId: string, userId: string, likeStatus: LikeStatus): Promise<void> {
        const statusBody: LikesForComms = {
            commentId: commentId,
            userId: userId,
            likeStatus: likeStatus,
        };

        await this.likesCommsRepo.create(statusBody);
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
        return await this.likesCommsQueryRepo.findStatus(commentId, userId)
    }

    async removeStatus(commentId: string, userId: string): Promise<void> {
        return await this.likesCommsRepo.removeStatus(commentId, userId)
    }
}