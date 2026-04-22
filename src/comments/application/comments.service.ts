import { usersQueryRepo } from "../../composition-root";
import { CommentsRepository } from "../repositories/comments.repository";
import { Comment } from "../types/comments";

export class CommentsService {
  private commentsRepo: CommentsRepository
  constructor(commentsRepo: CommentsRepository) {
    this.commentsRepo = commentsRepo;
  }

  async create(
    content: string,
    postId: string,
    userId: string,
  ): Promise<string> {
    const user = await usersQueryRepo.findById(userId);

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
};
