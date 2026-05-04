import "reflect-metadata";
import { Blog } from "../types/blogs.type";
import { CreateBlogDto } from "../types/createBlogDto.type";
import { BlogsRepository } from "../repositories/blogs.repository";
import { BlogsQueryDtoInput } from "../input/blogs-query.input";
import { WithId } from "mongodb";
import { BlogsQwRepository } from "../repositories/blogs-query.repository";
import { inject, injectable } from "inversify";
import { BlogsModel } from "../models/blogs.schema";

@injectable()
export class BlogsService {

  constructor(
    @inject(BlogsRepository) protected blogsRepo: BlogsRepository, 
    @inject(BlogsQwRepository) protected blogsQueryRepo: BlogsQwRepository) {}

  async create(blogDto: CreateBlogDto): Promise<string> {
    /* const newBlog: Blog = {
      name: blogDto.name,
      description: blogDto.description,
      websiteUrl: blogDto.websiteUrl,
      createdAt: new Date(),
      isMembership: false,
    }; */
    const blog = await BlogsModel.create(blogDto);

    const blogsId = await this.blogsRepo.create(blog);

    return blogsId;
  }

  async update(id: string, dto: CreateBlogDto): Promise<void> {
    return await this.blogsRepo.update(id, dto);
  }

  async delete(id: string): Promise<void> {
    return await this.blogsRepo.delete(id);
  }

  async findAll(
    queryDto: BlogsQueryDtoInput,
  ): Promise<{ items: WithId<Blog>[]; totalCount: number }> {
    return await this.blogsQueryRepo.findAll(queryDto);
  }

  async findById(id: string): Promise<WithId<Blog>> {
    return await this.blogsQueryRepo.findById(id);
  }
}
