import { PostViewModel } from "../../types/postViewModel";
import { PostsDocument } from "../../domain/posts.model";

export function mapToPostViewModel(post: PostsDocument): PostViewModel {
  return {
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
  };
}
