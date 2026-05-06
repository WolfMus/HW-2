import { WithId } from "mongodb";
import { BlogsQueryDtoInput } from "../input/blogs-query.input";
import { Blog } from "../types/blogs.type";
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";
import { injectable } from "inversify";
import { BlogsDocument, BlogsModel } from "../domain/blogs.model";

@injectable()
export class BlogsQwRepository {

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

    const items = await BlogsModel
      .find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(pageSize)
      .lean();

    const totalCount = await BlogsModel.countDocuments(filter);

    return { items, totalCount };
  }

  async findById(id: string): Promise<BlogsDocument> {
    const blog = await BlogsModel.findById(id);
    if (!blog) {
      throw new RepositoryNotFoundError("Blog not found", "id");
    }
    return blog;
  }

}
