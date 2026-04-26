import { ObjectId, WithId } from "mongodb";
import { Comment } from "../types/comments";
import { commentsCollection } from "../../db/mongo.db";
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";
import { CommentViewModel } from "../types/commentViewModel";
import { Pagination } from "../../core/types/pagination.interface";
import { CommentQueryDtoInput } from "../types/commentQueryDtoInput";
import { injectable } from "inversify";

@injectable()
export class CommentsQwRepository {
  async findByPostId(
    postId: string,
    query: CommentQueryDtoInput,
  ): Promise<Pagination<CommentViewModel[]>> {
    const { pageNumber, pageSize, sortBy, sortDirection } = query;

    const skip = (pageNumber - 1) * pageSize;
    const filter = { postId: postId };
    const sortOrder = sortDirection === "asc" ? 1 : -1;

    const items = await commentsCollection
      .find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCount = await commentsCollection.countDocuments(filter);

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount,
      items: items.map((u) => this._getToViewModel(u)),
    };
  }

  async getCommentById(id: string): Promise<WithId<Comment>> {
    const comment = await commentsCollection.findOne({ _id: new ObjectId(id) });

    if (!comment) {
      throw new RepositoryNotFoundError("Comment not found", "id");
    }

    return comment;
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
