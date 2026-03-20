import { ObjectId } from "mongodb";
import { commentsCollection } from "../../db/mongo.db";
import { Comment } from "../types/comments";
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";

export const commentsRepository = {
  async create(newComment: Comment): Promise<string> {
    const insertResult = await commentsCollection.insertOne(newComment);

    return insertResult.insertedId.toString();
  },

  async update(id: string, content: string): Promise<void> {
    const updatedResult = await commentsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          content: content,
        },
      },
    );

    if (updatedResult.matchedCount < 1) {
      throw new RepositoryNotFoundError("Comment not found", "id");
    }

    return;
  },

  async delete(id: string): Promise<void> {
    const deletedComment = await commentsCollection.deleteOne({_id: new ObjectId(id)})
    if (deletedComment.deletedCount < 1) {
      throw new RepositoryNotFoundError("Comment not found", "id")
    }
    return;
  }
};
