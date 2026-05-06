import { WithId } from "mongodb";
import { CreatePostDto } from "../types/createPostsDto.type";
import { Post } from "../types/posts";
import { PostsRepository } from "../repository/posts.repository";
import { PostsQueryDtoInput } from "../input/post-query.input";
import { PostsQwRepository } from "../repository/posts-query.repository";
import { inject, injectable } from "inversify";
import { PostsDocument, PostsModel } from "../domain/posts.model";
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";
@injectable()
export class PostsService {

  constructor(
    @inject(PostsRepository) protected postsRepo: PostsRepository, 
    @inject(PostsQwRepository) protected postsQueryRepo: PostsQwRepository
  ) {}

  async create(dto: CreatePostDto, blogName: string): Promise<string> {
    const post = PostsModel.createPost(dto, blogName);
    return await this.postsRepo.save(post);
  }
  
  async update(id: string, body: CreatePostDto): Promise<void> {
    const post = await PostsModel.findById(id);
    if (!post) {
      throw new RepositoryNotFoundError("Post not found", "id")
    }
    post.update(body);
    return await this.postsRepo.update(post);
  }
  
  async delete(id: string): Promise<void> {
    return await this.postsRepo.delete(id);
  }
  
  async findAll(
    queryDto: PostsQueryDtoInput,
  ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
    return await this.postsQueryRepo.findAll(queryDto);
  }
  
  async findById(id: string): Promise<PostsDocument> {
    return await this.postsQueryRepo.findById(id);
  }


  // FOR BLOG 
  async createForBlog(
    dto: CreatePostDto,
    blogName: string,
  ): Promise<string> {
    const post = PostsModel.createPost(dto, blogName);
    return await this.postsRepo.save(post);
  }

  async findByBlogId(
    id: string,
    queryDto: PostsQueryDtoInput,
  ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
    return await this.postsQueryRepo.findByBlogId(id, queryDto);
  }

}
