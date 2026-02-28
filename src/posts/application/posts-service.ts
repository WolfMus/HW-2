import { WithId } from "mongodb";
import { PostInputModel } from "../dto/posts-input.dto";
import { Post } from "../types/posts";
import { postsRepository } from "../repository/posts.repository";
import { Blog } from "../../blogs/types/blogs";
import { PostsQueryDtoInput } from "../input/post-query.input";

export const postsServices = {
  async findAll(queryDto: PostsQueryDtoInput): Promise<{items: WithId<Post>[]; totalCount: number }> {
    return await postsRepository.findAll(queryDto);
  },

  async findById(id: string): Promise<WithId<Post>> {
    return await postsRepository.findById(id);
  },

  async create(dto: PostInputModel, blog: WithId<Blog>): Promise<WithId<Post>> {

    const newPost: Post = {
          title: dto.title,
          shortDescription: dto.shortDescription,
          content: dto.content,
          blogId: dto.blogId,
          blogName: blog.name,
          createdAt: new Date(),
        };
    const createdPost = await postsRepository.create(newPost);
    return createdPost;
  },

  async update(id: string, body: PostInputModel): Promise<void> {
    return await postsRepository.update(id, body);
  },

  async delete(id: string): Promise<void> {
    return await postsRepository.delete(id);
  },
};
