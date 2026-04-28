import { ObjectId } from "mongodb";
import { Comment } from "../types/comments";
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";
import { injectable } from "inversify";
import { commentsModel } from "../models/comments.schema";

@injectable()
export class CommentsRepository {
  async create(newComment: Comment): Promise<string> {
    const insertResult = await commentsModel.insertOne(newComment);

    return insertResult._id.toString();
  }

  async update(id: string, content: string): Promise<void> {
    const updatedResult = await commentsModel.updateOne(
      { _id: new ObjectId(id) },
      {
          content: content,
      },
    );

    if (updatedResult.matchedCount < 1) {
      throw new RepositoryNotFoundError("Comment not found", "id");
    }

    return;
  }

  async delete(id: string): Promise<void> {
    const deletedComment = await commentsModel.deleteOne({
      _id: new ObjectId(id),
    });
    if (deletedComment.deletedCount < 1) {
      throw new RepositoryNotFoundError("Comment not found", "id");
    }
    return;
  }
}
