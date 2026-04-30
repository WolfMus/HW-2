import { ObjectId } from "mongodb";
import { Comment } from "../types/comments.type";
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";
import { injectable } from "inversify";
import { commentsModel } from "../models/comments.schema";
import { log } from "console";

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

  async changeStatus(
    id: string,
    incrStatus: string,
    decrStatus: string,
  ): Promise<void> {
    const obj: Record<string, number> = {};

    if (incrStatus !== "None" || decrStatus !== "None") {
      obj[`${incrStatus}sCount`] = +1;
      obj[`${decrStatus}sCount`] = -1;
    }
    
    if (incrStatus === "None" && decrStatus !== "None") {
      obj[`${decrStatus}sCount`] = -1;
    }

    if (incrStatus !== "None" && decrStatus === "None") {
      obj[`${incrStatus}sCount`] = +1;
    }

    log("Object: ", obj);
    
    const updatedResult = await commentsModel.updateOne(
      { id },
      {
        likesInfo: {
          $inc: obj
        }
      },
    );
    
    delete obj[0];
    log("Object: ", obj);

    if (updatedResult.matchedCount < 1) {
      throw new RepositoryNotFoundError("Comment not found", "id");
    }

    return
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
