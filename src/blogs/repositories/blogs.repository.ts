import { Blog } from "../types/blogs";
import { BlogInputModel } from "../dto/blog-input.dto";
import { blogsCollection } from "../../db/mongo.db";
import { ObjectId, WithId } from "mongodb";
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";
import { BlogsQueryDtoInput } from "../input/blogs-query.input";

export const blogsRepository = {
  async findAll(
    queryDto: BlogsQueryDtoInput,
  ): Promise<{ items: WithId<Blog>[]; totalCount: number }> {

    const { 
      pageNumber, 
      pageSize, 
      sortBy, 
      sortDirection, 
      searchBlogNameTerm } = queryDto;

    console.log('search term: ', searchBlogNameTerm);

    const skip = (pageNumber - 1) * pageSize;
    const filter: any = {};

    if (searchBlogNameTerm) {
      filter.name = { $regex: searchBlogNameTerm, $options: 'i' };
    }

    const sortOrder = sortDirection === 'asc' ? 1 : -1;

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

  async create(newBlog: Blog): Promise<WithId<Blog>> {
    const insertResult = await blogsCollection.insertOne(newBlog);

    return { ...newBlog, _id: insertResult.insertedId };
  },

  async update(id: string, dto: BlogInputModel): Promise<void> {
    const updatedResult = await blogsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: dto.name,
          description: dto.description,
          websiteUrl: dto.websiteUrl,
        },
      },
    );

    if (updatedResult.matchedCount < 1) {
      throw new RepositoryNotFoundError("Blog not found", "id");
    }

    return;
  },

  async delete(id: string): Promise<void> {
    const deletedResult = await blogsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (deletedResult.deletedCount < 1) {
      throw new RepositoryNotFoundError(
        "Blogs wasn't deleted. Blog not exist",
        "id",
      );
    }
    return;
  },
};
