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
    extendedLikesInfo: {
        likesCount: post.extendedLikesInfo.likesCount,
        dislikesCount: post.extendedLikesInfo.dislikesCount,
        myStatus: post.extendedLikesInfo.myStatus,
        newestLikes: {
            addedAt: new Date(),
            userId: 0,
            login: 0,
  };
}
  }}