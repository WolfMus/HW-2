import { WithId } from "mongodb";
import { CreatePostDto } from "../types/createPostsDto.type";
import { Post } from "../types/posts";
import { PostsRepository } from "../repository/posts.repository";
import { Blog } from "../../blogs/types/blogs.type";
import { PostInputForBlogModel } from "../dto/post-input-for-blog.dto";
import { PostsQueryDtoInput } from "../input/post-query.input";
import { PostsQwRepository } from "../repository/posts-query.repository";
import { inject, injectable } from "inversify";
import { PostsModel } from "../models/posts.schema";
@injectable()
export class PostsService {

  constructor(
    @inject(PostsRepository) protected postsRepo: PostsRepository, 
    @inject(PostsQwRepository) protected postsQueryRepo: PostsQwRepository
  ) {}

  async create(dto: CreatePostDto, blogName: string): Promise<string> {
    const post = PostsModel.create(dto, blogName);
    console.log(post)
    return await this.postsRepo.save(post);
  }

  async createForBlog(
    dto: PostInputForBlogModel,
    blog: WithId<Blog>,
  ): Promise<string> {
    const newPost: Post = {
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: blog._id.toString(),
      blogName: blog.name,
      createdAt: new Date(),
    };
    const createdPostId = await this.postsRepo.create(newPost);
    return createdPostId;
  }

  async update(id: string, body: CreatePostDto): Promise<void> {
    return await this.postsRepo.update(id, body);
  }

  async delete(id: string): Promise<void> {
    return await this.postsRepo.delete(id);
  }

  async findAll(
    queryDto: PostsQueryDtoInput,
  ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
    return await this.postsQueryRepo.findAll(queryDto);
  }

  async findByBlogId(
    id: string,
    queryDto: PostsQueryDtoInput,
  ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
    return await this.postsQueryRepo.findByBlogId(id, queryDto);
  }

  async findById(id: string): Promise<WithId<Post>> {
    return await this.postsQueryRepo.findById(id);
  }
}
