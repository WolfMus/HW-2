import { CreatePostDto } from "../types/createPostsDto.type";
import { PostsRepository } from "../repository/posts.repository";
import { PostsQueryDtoInput } from "../input/post-query.input";
import { PostsQwRepository } from "../repository/posts-query.repository";
import { inject, injectable } from "inversify";
import { PostsDocument, PostsModel } from "../domain/posts.model";
import { LikeStatus } from "../../comments/types/likeComments.enum";
import { LikesForPostsQwRepository } from "../../likes/forPosts/repository/likes-posts-query.repository";
import { LikesForPostDocument } from "../../likes/forPosts/models/like-posts.model";

@injectable()
export class PostsService {

  constructor(
    @inject(PostsRepository) protected postsRepo: PostsRepository, 
    @inject(PostsQwRepository) protected postsQueryRepo: PostsQwRepository,
    @inject(LikesForPostsQwRepository) protected likesPostsQueryRepo: LikesForPostsQwRepository,
  ) {}

  async create(dto: CreatePostDto, blogName: string): Promise<string> {
    const post = PostsModel.createPost(dto, blogName);
    return await this.postsRepo.create(post);
  }
  
  async update(id: string, body: CreatePostDto): Promise<void> {
    const post = await this.postsQueryRepo.findById(id);
    post.update(body);
    return await this.postsRepo.save(post);
  }
  
  async delete(id: string): Promise<void> {
    return await this.postsRepo.delete(id);
  }
  
  async findAll(
    queryDto: PostsQueryDtoInput,
  ): Promise<{ items: PostsDocument[]; totalCount: number }> {
    return await this.postsQueryRepo.findAll(queryDto);
  }
  
  async findById(id: string): Promise<PostsDocument> {
    const post = await this.postsRepo.findById(id);
    const newestLikes: LikesForPostDocument[] = await this.likesPostsQueryRepo.findNewestLikes(id);
    post.updateNewestLikes(newestLikes);
    await this.postsRepo.save(post);
    return post
  }


  // FOR BLOG 
  async createForBlog(dto: CreatePostDto, blogName: string): Promise<string> {
    const post = PostsModel.createPost(dto, blogName);
    return await this.postsRepo.create(post);
  }

  async findByBlogId(id: string, queryDto: PostsQueryDtoInput): Promise<{ items: PostsDocument[]; totalCount: number }> {
    return await this.postsQueryRepo.findByBlogId(id, queryDto);
  }

  // LIKES
  async changeLikeStatus(postId: string,  likePrev: LikeStatus, likeCurrent: LikeStatus) {
    const post = await this.postsRepo.findById(postId);
    post.updateStatus(likePrev, likeCurrent);
    await this.postsRepo.save(post);
    return;
  }

}
