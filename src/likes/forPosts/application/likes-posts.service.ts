import { injectable, inject } from "inversify";
import { LikesForPostsRepository } from "../repository/likes-posts.repository";
import { LikesForPostsQwRepository } from "../repository/likes-posts-query.repository";
import { LikesForPostModel } from "../models/like-posts.model";
import { LikeStatus } from "../../../comments/types/likeComments.enum";
import { BadRequestError } from "../../../core/errors/bad-request.error";
import { PostsService } from "../../../posts/application/posts-service";

@injectable()
export class LikesForPostsService {
  constructor(
    @inject(LikesForPostsRepository)
    protected LikesPostsRepo: LikesForPostsRepository,
    @inject(LikesForPostsQwRepository)
    protected LikesPostsQueryRepo: LikesForPostsQwRepository,
    @inject(PostsService)
    protected PostsService: PostsService,
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
    )

    // Нет статуса => создаем лайк => сохраняем => меняем счетчик
    if (likePrev === null && likeStatus !== LikeStatus.None) {
      const like = LikesForPostModel.createLike(likeStatus, postId, userId);
      await this.LikesPostsRepo.save(like);
      await this.PostsService.changeLikeStatus(postId, LikeStatus.None, likeStatus);
      return;
    }

    // Есть повторение => возврат в контроллер
    if ((likePrev === null && likeStatus === LikeStatus.None) || likePrev!.likeStatus === likeStatus) {
      return;
    }

    // Есть статус =>
    if (likePrev) {

      // => Если None => удаляем из БД => меняем счетчик
      if (likeStatus === LikeStatus.None) {
        await this.LikesPostsRepo.delete(likePrev.id);
        await this.PostsService.changeLikeStatus(postId, likePrev.likeStatus, likeStatus);
        return;
      }

      // => меняем статус и дату => меняем счетчик => сохраняем
      const likeChanged = await likePrev.updateStatus(likeStatus);
      await this.LikesPostsRepo.save(likeChanged);
      await this.PostsService.changeLikeStatus(postId, likePrev.likeStatus, likeStatus);
      return;
    }
  }
}