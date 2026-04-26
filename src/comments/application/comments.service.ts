import { WithId } from "mongodb";
import { CommentsRepository } from "../repositories/comments.repository";
import { Comment } from "../types/comments";
import { CommentViewModel } from "../types/commentViewModel";
import { CommentsQwRepository } from "../repositories/comments-query.repository";
import { UsersQwRepository } from "../../users/repository/usersQw.repository";
import { CommentQueryDtoInput } from "../types/commentQueryDtoInput";
import { Pagination } from "../../core/types/pagination.interface";
import { inject, injectable } from "inversify";

@injectable()
export class CommentsService {
  constructor(
    @inject(CommentsRepository) protected commentsRepo: CommentsRepository,
    @inject(CommentsQwRepository) protected commentsQueryRepo: CommentsQwRepository,
    @inject(UsersQwRepository) protected usersQueryRepo: UsersQwRepository,
  ) {}

  async create(
    content: string,
    postId: string,
    userId: string,
  ): Promise<string> {
    const user = await this.usersQueryRepo.findById(userId);

    const newComment: Comment = {
      postId: postId,
      content: content,
      userId: userId,
      userLogin: user.login,
      createdAt: new Date(),
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
  ): Promise<Pagination<CommentViewModel[]>> {
    return await this.commentsQueryRepo.findByPostId(postId, query);
  }

  async getById(id: string): Promise<CommentViewModel> {
    const comment = await this.commentsQueryRepo.getCommentById(id);

    return this._getToViewModel(comment);
  }

  _getToViewModel(model: WithId<Comment>): CommentViewModel {
    return {
      id: model._id.toString(),
      content: model.content,
      commentatorInfo: {
        userId: model.userId,
        userLogin: model.userLogin,
      },
      createdAt: model.createdAt,
    };
  }
}
