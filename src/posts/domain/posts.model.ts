import mongoose, { HydratedDocument, Model, model } from "mongoose";
import { Post } from "../types/posts";
import { CreatePostDto } from "../types/createPostsDto.type";

interface PostsMethods {
  update(dto: CreatePostDto): void;
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
});

class PostsEntity {
  private constructor(
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public blogName: string,
    public createdAt: Date,
  ) {}

  static createPost(dto: CreatePostDto, blogName: string) {
    const post = new PostsModel({ dto });
    post.blogName = blogName;
    post.createdAt = new Date();
    return post;
  }

  async update(dto: CreatePostDto): Promise<void> {
    this.title = dto.title;
    this.shortDescription = dto.shortDescription;
    this.content = dto.content;
    return;
  }
}

postsScheme.loadClass(PostsEntity);
export const PostsModel = model<Post, PostsModel>("Posts", postsScheme);
