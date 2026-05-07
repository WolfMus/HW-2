import { injectable, inject } from "inversify";
import { LikesForPostsRepository } from "../repository/likes-posts.repository";
import { LikesForPostsQwRepository } from "../repository/likes-posts-query.repository";
import { LikesForPostModel } from "../models/like-posts.model";
import { LikeStatus } from "../../../comments/types/likeComments.enum";
import { BadRequestError } from "../../../core/errors/bad-request.error";

@injectable()
export class LikesForPostsService {
  constructor(
    @inject(LikesForPostsRepository)
    protected LikesPostsRepo: LikesForPostsRepository,
    @inject(LikesForPostsQwRepository)
    protected LikesPostsQueryRepo: LikesForPostsQwRepository,
  ) {}

  async create(postId: string, userId: string, likeStatus: LikeStatus): Promise<void> {
    // Валидируем статуса (убрать отсюда в мидлвейр-валидатор)
    const isValid = Object.values(LikeStatus).includes(
      likeStatus as LikeStatus,
    );
    if (!isValid) {
      throw new BadRequestError("Invalid like status", "like-status");
    };

    // Есть ли в БД статус?
    const likePrev = await this.LikesPostsQueryRepo.findByPostAndUserId(
      postId,
      userId,
    );
    console.log("likePrev: ", likePrev);
    // Нет статуса => создаем лайк => сохраняем
    if (likePrev === null) {
      const like = LikesForPostModel.createLike(likeStatus, postId, userId);
      await this.LikesPostsRepo.save(like);
      return;
    }
    // Есть повторение => возврат в контроллер
    if (likePrev.likeStatus === likeStatus || (likePrev === null && likeStatus === LikeStatus.None)) {
      return;
    }
    // Есть статус => меняем статус и дату => сохраняем
    if (likePrev) {
      const likeChanged = likePrev.updateStatus(likeStatus);
      await this.LikesPostsRepo.save(likeChanged);
      return;
    }
  }
}