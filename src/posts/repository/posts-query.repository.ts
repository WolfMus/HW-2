import { ObjectId, WithId } from "mongodb";
import { PostsQueryDtoInput } from "../input/post-query.input";
import { Post } from "../types/posts";
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";
import { injectable } from "inversify";
import { PostsModel } from "../models/posts.schema";
@injectable()
export class PostsQwRepository {
  async findAll(
    queryDto: PostsQueryDtoInput,
  ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryDto;

    const skip = (pageNumber - 1) * pageSize;

    const sortOrder = sortDirection === "asc" ? 1 : -1;

    const items = await PostsModel
      .find()
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(pageSize)
      .lean();

    const totalCount = await PostsModel.countDocuments();

    return { items, totalCount };
  }

  async findByBlogId(
    id: string,
    queryDto: PostsQueryDtoInput,
  ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryDto;

    const skip = (pageNumber - 1) * pageSize;
    const filter = { blogId: id };
    const sortOrder = sortDirection === "asc" ? 1 : -1;

    const [items, totalCount] = await Promise.all([
      PostsModel
        .find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      PostsModel.countDocuments(filter),
    ]);

    return { items, totalCount };
  }

  async findById(id: string): Promise<WithId<Post>> {
    const post = await PostsModel.findOne({ _id: new ObjectId(id) });

    if (!post) {
      throw new RepositoryNotFoundError("Post id not found", "id");
    }
    return post;
  }
}
