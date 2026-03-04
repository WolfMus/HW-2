import { ObjectId, WithId } from "mongodb";
import { PostsQueryDtoInput } from "../input/post-query.input";
import { Post } from "../types/posts";
import { postsCollection } from "../../db/mongo.db";
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";

export const postsQwRepository = {
    
  async findAll(
    queryDto: PostsQueryDtoInput,
  ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryDto;

    const skip = (pageNumber - 1) * pageSize;

    const sortOrder = sortDirection === "asc" ? 1 : -1;

    const items = await postsCollection
      .find()
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCount = await postsCollection.countDocuments();

    return { items, totalCount };
  },

  async findByBlogId(id: string, queryDto: PostsQueryDtoInput): Promise< {items: WithId<Post>[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryDto;

    const skip = (pageNumber - 1) * pageSize;
    const filter = { 'blogId': id };
    const sortOrder = sortDirection === 'asc' ? 1 : -1;

    const [items, totalCount] = await Promise.all([
      postsCollection
        .find(filter)
        .sort({ [sortBy]: sortOrder})
        .skip(skip)
        .limit(pageSize)
        .toArray(),
      postsCollection.countDocuments(filter),
    ]);

      return {items, totalCount};
  },

  async findById(id: string): Promise<WithId<Post>> {
    const post = await postsCollection.findOne({ _id: new ObjectId(id) });
    if (!post) {
      throw new RepositoryNotFoundError("Post id not found", "id");
    }
    return post;
  }
}