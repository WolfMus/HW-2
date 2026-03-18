import { usersQwRepository } from "../../users/repository/usersQw.repository";
import { commentsRepository } from "../repositories/comments.repository";
import { Comment } from "../types/comments";

export const commentService = {
  async create(
    content: string,
    postId: string,
    userId: string,
  ): Promise<string> {
    const user = await usersQwRepository.findById(userId);

    const newComment: Comment = {
      postId: postId,
      content: content,
      userId: userId,
      userLogin: user.login,
      createdAt: new Date(),
    };

    const commentId = await commentsRepository.create(newComment);

    return commentId;
  },
};
