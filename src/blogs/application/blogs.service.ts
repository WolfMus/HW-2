import { Blog } from "../types/blogs";
import { BlogInputModel } from "../dto/blog-input.dto";
import { BlogsRepository} from "../repositories/blogs.repository";
import { BlogsQueryDtoInput } from "../input/blogs-query.input";
import { WithId } from "mongodb";
import { BlogsQwRepository } from "../repositories/blogs-query.repository";

export class BlogsService {
  private blogsRepo: BlogsRepository;
  private blogsQueryRepo: BlogsQwRepository;
  
  constructor(blogsRepo: BlogsRepository, blogsQueryRepo: BlogsQwRepository){
    this.blogsRepo = blogsRepo;
    this.blogsQueryRepo = blogsQueryRepo;
  }

  async create(blogDto: BlogInputModel): Promise<string> {
    
    const newBlog: Blog = {
      name: blogDto.name,
      description: blogDto.description,
      websiteUrl: blogDto.websiteUrl,
      createdAt: new Date(),
      isMembership: false,
    };

    const blogsId = await this.blogsRepo.create(newBlog);

    return blogsId;
  }

  async update(id: string, dto: BlogInputModel): Promise<void> {
    return await this.blogsRepo.update(id, dto);
  }

  async delete(id: string): Promise<void> {
    return await this.blogsRepo.delete(id);
  }

  async findAll(queryDto: BlogsQueryDtoInput): Promise<{ items: WithId<Blog>[]; totalCount: number }> {
    return await this.blogsQueryRepo.findAll(queryDto)
  }

  async findById(id: string): Promise<WithId<Blog>> {
    return await this.blogsQueryRepo.findById(id);
  }
};
