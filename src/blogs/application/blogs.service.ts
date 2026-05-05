import "reflect-metadata";
import { Blog } from "../types/blogs.type";
import { CreateBlogDto } from "../types/createBlogDto.type";
import { BlogsRepository } from "../repositories/blogs.repository";
import { BlogsQueryDtoInput } from "../input/blogs-query.input";
import { WithId } from "mongodb";
import { BlogsQwRepository } from "../repositories/blogs-query.repository";
import { inject, injectable } from "inversify";
import { BlogsDocument, BlogsModel } from "../domain/blogs.model";

@injectable()
export class BlogsService {
  constructor(
    @inject(BlogsRepository) protected blogsRepo: BlogsRepository,
    @inject(BlogsQwRepository) protected blogsQueryRepo: BlogsQwRepository,
  ) {}

  // Create blog
  async create(blogDto: CreateBlogDto): Promise<string> {
    const blog = BlogsModel.createBlog(blogDto)
    return await this.blogsRepo.create(blog);;
  }

  // Update blog
  async update(id: string, dto: CreateBlogDto): Promise<void> {
    const blog = await this.blogsQueryRepo.findById(id);
    blog.update(dto);
    return await this.blogsRepo.update(blog);
  }

  // Delete blog
  async delete(id: string): Promise<void> {
    await this.blogsQueryRepo.findById(id);
    return await this.blogsRepo.delete(id);
  }

  // Find list of blogs
  async findAll(
    queryDto: BlogsQueryDtoInput,
  ): Promise<{ items: WithId<Blog>[]; totalCount: number }> {
    return await this.blogsQueryRepo.findAll(queryDto);
  }

  // Find blog by id
  async findById(id: string): Promise<BlogsDocument> {
    return await this.blogsQueryRepo.findById(id);
  }
}
