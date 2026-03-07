import { ObjectId, WithId } from "mongodb";
import { BlogsQueryDtoInput } from "../input/blogs-query.input";
import { Blog } from "../types/blogs";
import { blogsCollection } from "../../db/mongo.db";
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";

export const blogsQwRepository = {
  async findAll(
    queryDto: BlogsQueryDtoInput,
  ): Promise<{ items: WithId<Blog>[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } =
      queryDto;

    const skip = (pageNumber - 1) * pageSize;
    const filter: any = {};

    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: "i" };
    }

    const sortOrder = sortDirection === "asc" ? 1 : -1;

    const items = await blogsCollection
      .find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCount = await blogsCollection.countDocuments(filter);

    return { items, totalCount };
  },

  async findById(id: string): Promise<WithId<Blog>> {
    const blog = await blogsCollection.findOne({ _id: new ObjectId(id) });
    if (!blog) {
      throw new RepositoryNotFoundError("Blog not found", "id");
    }

    return blog;
  },
};
