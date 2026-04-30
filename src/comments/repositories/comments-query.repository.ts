import { WithId } from "mongodb";
import { Comment } from "../types/comments.type";
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";
import { CommentViewModel } from "../types/commentViewModel";
import { Pagination } from "../../core/types/pagination.interface";
import { CommentQueryDtoInput } from "../types/commentQueryDtoInput";
import { injectable } from "inversify";
import { commentsModel } from "../models/comments.schema";

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

    const items = await commentsModel
      .find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(pageSize)
      .lean();

    const totalCount = await commentsModel.countDocuments(filter);

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount,
      items: items.map((u) => this._getToViewModel(u)),
    };
  }

  async getCommentById(id: string): Promise<WithId<Comment>> {
    const comment = await commentsModel.findById(id);
    console.log(comment);
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
