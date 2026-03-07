import { WithId } from "mongodb";
import { PostInputModel } from "../dto/posts-input.dto";
import { Post } from "../types/posts";
import { postsRepository } from "../repository/posts.repository";
import { Blog } from "../../blogs/types/blogs";
import { PostInputForBlogModel } from "../dto/post-input-for-blog.dto";

export const postsServices = {
  async create(dto: PostInputModel, blog: WithId<Blog>): Promise<string> {
    const newPost: Post = {
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
      blogName: blog.name,
      createdAt: new Date(),
    };
    const createdPostId = await postsRepository.create(newPost);
    return createdPostId;
  },

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
    const createdPostId = await postsRepository.create(newPost);
    return createdPostId;
  },

  async update(id: string, body: PostInputModel): Promise<void> {
    return await postsRepository.update(id, body);
  },

  async delete(id: string): Promise<void> {
    return await postsRepository.delete(id);
  },
};
