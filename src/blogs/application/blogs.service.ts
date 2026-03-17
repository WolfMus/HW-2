import { Blog } from "../types/blogs";
import { BlogInputModel } from "../dto/blog-input.dto";
import { blogsRepository } from "../repositories/blogs.repository";

export const blogsServices = {

  async create(blogDto: BlogInputModel): Promise<string> {
    
    const newBlog: Blog = {
      name: blogDto.name,
      description: blogDto.description,
      websiteUrl: blogDto.websiteUrl,
      createdAt: new Date(),
      isMembership: false,
    };

    const blogsId = await blogsRepository.create(newBlog);

    return blogsId;
  },

  async update(id: string, dto: BlogInputModel): Promise<void> {
    return await blogsRepository.update(id, dto);
  },

  async delete(id: string): Promise<void> {
    return await blogsRepository.delete(id);
  },
};
