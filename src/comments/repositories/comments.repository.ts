import { ObjectId } from "mongodb";
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";
import { injectable } from "inversify";
import { CommentsDocument, CommentsModel } from "../models/comments.schema";

@injectable()
export class CommentsRepository {

  async save(comment: CommentsDocument): Promise<void> {
    comment.save();
    return;
  }

  async saveAndReturnId(comment: CommentsDocument): Promise<string> {
    comment.save();
    return comment._id.toString();
  }

  async findById(id: string): Promise<CommentsDocument> {
    const comment = await CommentsModel.findById({_id: id});
    if (!comment) {
      throw new RepositoryNotFoundError("Comment not found", "id");
    }
    return comment
  }

  async changeStatus(
    id: string,
    incrStatus: string,
    decrStatus: string,
  ): Promise<void> {
    const obj: Record<string, number> = {};

    if (incrStatus !== "None" && decrStatus !== "None") {
      obj[`likesInfo.${incrStatus}sCount`] = +1;
      obj[`likesInfo.${decrStatus}sCount`] = -1;
    }

    if (incrStatus === "None" && decrStatus !== "None") {
      obj[`likesInfo.${decrStatus}sCount`] = -1;
    }

    if (incrStatus !== "None" && decrStatus === "None") {
      obj[`likesInfo.${incrStatus}sCount`] = +1;
    }

    const updatedResult = await CommentsModel.updateOne({
      _id: id
    }, {
      $inc: obj,
    });

    if (updatedResult.modifiedCount < 1) {
      throw new RepositoryNotFoundError("Comment not found", "id");
    }

    return;
  }

  async delete(id: string): Promise<void> {
    const deletedComment = await CommentsModel.deleteOne({_id: id});
    if (deletedComment.deletedCount < 1) {
      throw new RepositoryNotFoundError("Comment not found", "id");
    }
    return;
  }
}
