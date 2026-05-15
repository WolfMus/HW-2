import mongoose, { HydratedDocument, Model, model } from "mongoose";
import { Post } from "../types/posts";
import { CreatePostDto } from "../types/createPostsDto.type";
import { BadRequestError } from "../../core/errors/bad-request.error";
import { LikeStatus } from "../../likes/types/likeComments.enum";
import { LikesForPostDocument } from "../../likes/forPosts/models/like-posts.model";

export type NewestLikes = {
  addedAt: Date | null,
  userId: string | null,
  login: string | null,
}

const newestLikesSchema = new mongoose.Schema<NewestLikes>({
  addedAt: { type: Date, required: true },
  userId: { type: String, required: true },
  login: { type: String, required: true },
})

interface PostsMethods {
  update(dto: CreatePostDto): void;
  updateStatus(likePrev: LikeStatus, likeCurrent: LikeStatus): void;
  updateNewestLikes(newestLikes: LikesForPostDocument): void;
}

type PostsStatics = typeof PostsEntity;
type PostsModel = Model<Post, unknown, PostsMethods> & PostsStatics;
export type PostsDocument = HydratedDocument<Post, PostsMethods>;

const postsScheme = new mongoose.Schema<Post>({
  title: { type: String, required: true },
  shortDescription: { type: String, required: true },
  content: { type: String, required: true },
  blogId: { type: String, required: true },
  blogName: { type: String, required: true },
  createdAt: { type: Date, required: true },
  extendedLikesInfo: {
    likesCount: { type: Number, default: 0, required: true },
    dislikesCount: { type: Number, default: 0,required: true},
    myStatus: { type: String, enum: LikeStatus, default: LikeStatus.None, required: true },
    newestLikes: {
      type: [newestLikesSchema],
      required: true,
      default: [],
    }
  }
});

class PostsEntity {
  private extendedLikesInfo: {
    likesCount: number,
    dislikesCount: number,
    myStatus: LikeStatus,
    newestLikes: [],
  }
  private constructor(
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public blogName: string,
    public createdAt: Date,
  ) {
    this.extendedLikesInfo = {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: LikeStatus.None,
      newestLikes: [],
    }
  }

  static createPost(dto: CreatePostDto, blogName: string) {
    const post = new PostsModel({ 
      ...dto,
      blogName: blogName,
      createdAt: new Date(),
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: LikeStatus.None,
        newestLikes: [],
      }
    });

    return post;
  }

  async update(dto: CreatePostDto): Promise<void> {

    if (!dto.title || dto.title.length < 1 || dto.title.length > 30) {
      throw new BadRequestError("Title is invalid", "title");
    }

    if (!dto.shortDescription || dto.shortDescription.length < 1 || dto.shortDescription.length > 100) {
      throw new BadRequestError("ShortDescription is invalid", "shortDescription");
    }

    if (!dto.content || dto.content.length < 1 || dto.content.length > 1000) {
      throw new BadRequestError("Content is invalid", "content");
    }

    this.title = dto.title;
    this.shortDescription = dto.shortDescription;
    this.content = dto.content;

    return;
  }

  async updateStatus(likePrev: LikeStatus, likeCurrent: LikeStatus): Promise<void> {
    // likePrev - что стояло
    // likeCurrent - что ставим

    if (likePrev === LikeStatus.Like) {
      if (this.extendedLikesInfo.likesCount > 0) {
        this.extendedLikesInfo.likesCount--;
      }
    } else if (likePrev === LikeStatus.Dislike) {
      if (this.extendedLikesInfo.dislikesCount > 0) {
        this.extendedLikesInfo.dislikesCount--;
      }
    }
    
    if (likeCurrent === LikeStatus.Dislike) {
      this.extendedLikesInfo.dislikesCount++;
    } else if (likeCurrent === LikeStatus.Like) {
      this.extendedLikesInfo.likesCount++;
    }
    
    return;
  }
}

postsScheme.loadClass(PostsEntity);
export const PostsModel = model<Post, PostsModel>("Posts", postsScheme);
