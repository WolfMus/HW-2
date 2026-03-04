import { Blog } from "../types/blogs";
import { BlogInputModel } from "../dto/blog-input.dto";
import { WithId } from "mongodb";
import { blogsRepository } from "../repositories/blogs.repository";
import { BlogsQueryDtoInput } from "../input/blogs-query.input"

export const blogsServices = {
  // async findMany(queryDto: BlogsQueryDtoInput): Promise< {items: WithId<Blog>[]; totalCount: number} > {
  //   return blogsRepository.findAll(queryDto);
  // },

  // async findByIdOrFail(id: string): Promise<WithId<Blog>> {
  //   return await blogsRepository.findById(id);
  // },

  async create(blogDto: BlogInputModel): Promise<string> {

    const newBlog: Blog = {
        name: blogDto.name,
        description: blogDto.description,
        websiteUrl: blogDto.websiteUrl,
        createdAt: new Date(),
        isMembership: false,
    };

    const blogsId = await blogsRepository.create(newBlog);

    return blogsId
  },

  async update(id: string, dto: BlogInputModel): Promise<void> {
    return await blogsRepository.update(id, dto);
  },

  async delete(id: string): Promise<void> {
    return await blogsRepository.delete(id);
  },
};
