import { db } from "../../db/in-memory.db";
import { PostInputModel } from "../dto/posts-input.dto";
import { PostViewModel } from "../types/posts";

export const postsRepository = {
  findAll(): PostViewModel[] {
    return db.posts;
  },

  findById(id: string): PostViewModel | null {
    const post = db.posts.find((p) => p.id === id) ?? null;
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

  delete(id: string): void {
    const index = db.posts.findIndex(p => p.id === id)
    db.posts.splice(index, 1)
    return;
  },
};
