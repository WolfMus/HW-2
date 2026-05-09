import { WithId } from "mongodb";
import { CommentsRepository } from "../repositories/comments.repository";
import { Comment } from "../types/comments.type";
import { CommentViewModel } from "../types/commentViewModel";
import { CommentsQwRepository } from "../repositories/comments-query.repository";
import { UsersQwRepository } from "../../users/repository/usersQw.repository";
import { CommentQueryDtoInput } from "../types/commentQueryDtoInput";
import { Pagination } from "../../core/types/pagination.interface";
import { inject, injectable } from "inversify";
import { LikeStatus } from "../../likes/types/likeComments.enum";
import { LikesForCommsQwRepository } from "../../likes/forComments/repository/likes-comms-query.repository";
import { UsersRepository } from "../../users/repository/users.repository";

@injectable()
export class CommentsService {
  constructor(
    @inject(CommentsRepository) protected commentsRepo: CommentsRepository,
    @inject(CommentsQwRepository) protected commentsQueryRepo: CommentsQwRepository,
    @inject(UsersQwRepository) protected usersQueryRepo: UsersQwRepository,
    @inject(UsersRepository) protected usersRepo: UsersRepository,
    @inject(LikesForCommsQwRepository) protected likesQueryRepo: LikesForCommsQwRepository,
  ) {}

  async create(
    content: string,
    postId: string,
    userId: string,
  ): Promise<string> {
    const user = await this.usersRepo.findById(userId);

    const newComment: Comment = {
      content: content,
      postId: postId,
      commentatorInfo: {
        userId: userId,
        userLogin: user.login,
      },
      createdAt: new Date(),
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: LikeStatus.None,
      },
    };

    const commentId = await this.commentsRepo.create(newComment);

    return commentId;
  }

  async update(commentContent: string, id: string): Promise<void> {
    return await this.commentsRepo.update(id, commentContent);
  }

  async delete(id: string): Promise<void> {
    return await this.commentsRepo.delete(id);
  }

  async findByPostId(
    postId: string,
    query: CommentQueryDtoInput,
    userId: string,
  ): Promise<Pagination<CommentViewModel[]>> {
    const comments = await this.commentsQueryRepo.findByPostId(postId, query);

    // Получил айдишники комментариев
    const commentsInfo: string[] = comments.items.map(item =>
      item.id
    )

    // Нашел комментарии с которыми пользователь взаимодействовал
    const statuses = await this.likesQueryRepo.findMany(commentsInfo, userId);
    // Если комметариев нет, то ничего не меняем
    if (!statuses) {
      return comments
    }

    const statusMap = Object.fromEntries(statuses);
    const changedComments = comments.items.map(comment => {
        return {
          ...comment,
          likesInfo: {
            ...comment.likesInfo,
            myStatus: statusMap[comment.id] || "None" 
        },
    }})

    return {
      ...comments,
      items: changedComments,
    };
  }

  async getById(commentId: string, userId: string | null): Promise<CommentViewModel> {
    const comment = await this.commentsQueryRepo.getCommentById(commentId, );
    if (userId !== comment.commentatorInfo.userId) {
      return this._getToViewModel(comment);
    }

    const myStatus = await this.likesQueryRepo.getStatus(commentId, userId)
    if (myStatus) {
      comment.likesInfo.myStatus = myStatus!.toString()
      return this._getToViewModel(comment);
    }
    return this._getToViewModel(comment)
  }

  async changeStatus(id: string, currentStatus: string, previousStatus: string): Promise<void> {
    let decrStatus = "None";
    let incrStatus = "None";

    // Если не None, то уменьшается previousStatus
    if (previousStatus !== LikeStatus.None) {
      console.log(`${previousStatus} уменьшится`)
      decrStatus = previousStatus.toLowerCase(); 
    }
    // Если не None, то увеличивается currentStatus
    if (currentStatus !== LikeStatus.None) {
      console.log(`${currentStatus} увеличится`)
      incrStatus = currentStatus.toLowerCase();
    }

    await this.commentsRepo.changeStatus(id, incrStatus, decrStatus)
    return
  }

  _getToViewModel(model: WithId<Comment>): CommentViewModel {
    return {
      id: model._id.toString(),
      content: model.content,
      commentatorInfo: {
        userId: model.commentatorInfo.userId,
        userLogin: model.commentatorInfo.userLogin,
      },
      createdAt: model.createdAt,
      likesInfo: {
        likesCount: model.likesInfo.likesCount,
        dislikesCount: model.likesInfo.dislikesCount,
        myStatus: model.likesInfo.myStatus,
      },
    };
  }
}
