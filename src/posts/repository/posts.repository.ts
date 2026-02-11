import { db } from "../../db/in-memory.db";
import { PostInputModel } from "../dto/posts-input.dto";
import { PostViewModel } from "../types/posts";

export const postsRepository = {
  findAll(): PostViewModel[] {
    return db.posts;
  },

  findById(postId: string): PostViewModel | null {
    const post = db.posts.find((p) => p.id === postId) ?? null;
    return post;
  },

  create(newPost: PostViewModel): PostViewModel {
    db.posts.push(newPost);
    return newPost;
  },

  update(post: PostViewModel, body: PostInputModel): void {
    post.title = body.title;
    post.shortDescription = body.shortDescription;
    post.content = body.content;

    return;
  },

  delete(postId: string): void {
    db.posts.filter((p) => p.id !== postId);
    return;
  },
};
