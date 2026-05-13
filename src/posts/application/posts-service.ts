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
import { PaginatedOutput } from "../../core/types/paginated-output";
import { PostListPaginatedOutput } from "../output/postsListPaginatedOutput";

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
  ): Promise<{ posts: PostsDocument[]; totalCount: number }> {
    
    // ====== Ищу все посты и их кол-во ======
    const {items, totalCount} = await this.postsQueryRepo.findAll(queryDto);

    // ====== Создаю массив id постов и ищу для них лайки ======
    const postIds: string[] = items.map(p => p.id);
    const likes = await this.likesPostsQueryRepo.findNewestLikesForPosts(postIds);
    
    // ====== Создаю мап для поиска лайков по postId ======
    const likesMap: Map<string, LikesForPostDocument[]> = new Map();
    for (const like of likes) {
      likesMap.set(like._id, like.recentLikes);
    }

    // ====== Найти статус пользователя для каждого поста ======

    

    // ====== Вставляю массив лайков каждому посту ======
    // const posts = items.map(item => ({
    //   ...item,
    //   id: item._id.toString(),
    //   newestLikes: likesMap.get(item.id),
    // }))
    
    // ====== Вставляю массив лайков каждому посту ======
    const posts = items.map(item => ({

    }))
    // ====== Готовлю посты для передачи в контроллер ======

    console.log(posts);
    return { posts, totalCount }
  }
  
  async findById(id: string, userId?: string): Promise<PostViewModel> {
    const post = await this.postsRepo.findById(id);

    // Нахождение 3 последних лайков
    const lastThreeLikes: LikesForPostDocument[] = await this.likesPostsQueryRepo.findNewestLikes(id);
    const newestLikes: NewestLikes[] = [];

    // Нахождение логинов
    if (newestLikes) {
      for(let i = 0; i < lastThreeLikes.length; i++) {
        newestLikes.push({
          addedAt: lastThreeLikes[i]!.addedAt,
          userId: lastThreeLikes[i]!.userId,
          login: lastThreeLikes[i]!.login,
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

  async _ListToViewModel(queryDto: PostsQueryDtoInput, totalCount: number, posts: PostsDocument, newestLikes?: NewestLikes[], likeStatus: LikeStatus): Promise<PostListPaginatedOutput> {
     return {
    pagesCount: Math.ceil(queryDto.totalCount / queryDto.pageSize),
    page: queryDto.pageNumber,
    pageSize: queryDto.pageSize,
    totalCount: totalCount,
    items: posts.map(
      (post): PostViewModel => ({
        id: post.id,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
        extendedLikesInfo: {
          likesCount: post.extendedLikesInfo.likesCount,
          dislikesCount: post.extendedLikesInfo.dislikesCount,
          myStatus: likeStatus,
          newestLikes: newestLikes,
      }
      }),
    ),
  };
  }
}
