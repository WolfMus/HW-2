import { CreatePostDto } from "../types/createPostsDto.type";
import { PostsRepository } from "../repository/posts.repository";
import { PostsQueryDtoInput } from "../input/post-query.input";
import { PostsQwRepository } from "../repository/posts-query.repository";
import { inject, injectable } from "inversify";
import { NewestLikes, PostsDocument, PostsModel } from "../domain/posts.model";
import { LikeStatus } from "../../likes/types/likeComments.enum";
import { LikesForPostsQwRepository } from "../../likes/forPosts/repository/likes-posts-query.repository";
import { LikesForPostDocument } from "../../likes/forPosts/models/like-posts.model";
import { PostViewModel } from "../types/postViewModel";

@injectable()
export class PostsService {

  constructor(
    @inject(PostsRepository) protected postsRepo: PostsRepository, 
    @inject(PostsQwRepository) protected postsQueryRepo: PostsQwRepository,
    @inject(LikesForPostsQwRepository) protected likesPostsQueryRepo: LikesForPostsQwRepository,
  ) {}

  async create(dto: CreatePostDto, blogName: string): Promise<PostViewModel> {
    const post = PostsModel.createPost(dto, blogName);
    await this.postsRepo.create(post);
    return await this._ToViewModel(post);
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
  
  async findById(id: string, userId?: string): Promise<PostViewModel> {
    const post = await this.postsRepo.findById(id);

    // Нахождение 3 последних лайков
    const lastThreeLikes: LikesForPostDocument[] = await this.likesPostsQueryRepo.findNewestLikes(id);
    const newestLikes: NewestLikes[] = [];
    if (newestLikes) {
      for(let i = 0; i < lastThreeLikes.length; i++) {
        newestLikes.push({
          addedAt: lastThreeLikes[i]!.addedAt,
          userId: lastThreeLikes[i]!.userId,
          login: "ABOBA",
        })
    }
    }

    // Получение статуса пользователя
    if (userId) {
      const likeDocument = await this.likesPostsQueryRepo.findByPostAndUserId(id, userId);
      if (likeDocument) {
        return this._ToViewModel(post, newestLikes, likeDocument.likeStatus)
      }
    }

    return this._ToViewModel(post, newestLikes)
  }

  async isPostExist(id: string): Promise<void> {
    await this.postsRepo.isExist(id);
    return;
  }


  // FOR BLOG 
  async createForBlog(dto: CreatePostDto, blogName: string): Promise<PostViewModel> {
    const post = PostsModel.createPost(dto, blogName);
    const savedPost = await this.postsRepo.create(post);
    return await this._ToViewModel(savedPost)
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

  async _ToViewModel(post: PostsDocument, newestLikes?: NewestLikes[], likeStatus?: LikeStatus ): Promise<PostViewModel> {
    return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
      extendedLikesInfo: {
          likesCount: post.extendedLikesInfo.likesCount,
          dislikesCount: post.extendedLikesInfo.dislikesCount,
          myStatus: likeStatus || post.extendedLikesInfo.myStatus,
          newestLikes: newestLikes || [],
      }
    }
  }
}
