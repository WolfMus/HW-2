import { PostViewModel } from "../../types/postViewModel";
import { PostListPaginatedOutput } from "../../output/postsListPaginatedOutput";
import { PostsDocument } from "../../domain/posts.model";

export function mapToPostsListPaginatedOutput(
  newPost: PostsDocument[],
  params: {
    pageNumber: number;
    pageSize: number;
    totalCount: number;
  },
): PostListPaginatedOutput {
  return {
    pagesCount: Math.ceil(params.totalCount / params.pageSize),
    page: params.pageNumber,
    pageSize: params.pageSize,
    totalCount: params.totalCount,
    items: newPost.map(
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
          myStatus: post.extendedLikesInfo.myStatus,
          newestLikes: post.extendedLikesInfo.newestLikes,
      }
      }),
    ),
  };
}
