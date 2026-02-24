import { Blog } from "../types/blogs";
import { BlogInputModel } from "../dto/blog-input.dto";
import { blogsCollection } from "../../db/mongo.db";
import { ObjectId, WithId } from "mongodb";
import { blogsRepository } from "../repositories/blogs.repository";

export const blogsServices = {
  async findMany(): Promise<WithId<Blog>[]> {
    return blogsCollection.find().toArray();
  },

  async findByIdOrFail(id: string): Promise<WithId<Blog>> {
    return await blogsRepository.findById(id);
  },

  async create(blogDto: BlogInputModel): Promise<WithId<Blog>> {

    const newBlog: Blog = {
        name: blogDto.name,
        description: blogDto.description,
        websiteUrl: blogDto.websiteUrl,
        createdAt: new Date(),
        isMembership: false,
    };

    const createdBlog = await blogsRepository.create(newBlog);

    return createdBlog
  },

  async update(id: string, dto: BlogInputModel): Promise<void> {
    await blogsServices.findByIdOrFail(id);

    return await blogsRepository.update(id, dto);
  },

  async delete(id: string): Promise<void> {
    return await blogsRepository.delete(id);
  },
};
