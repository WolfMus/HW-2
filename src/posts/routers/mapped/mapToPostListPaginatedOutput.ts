import { PostViewModel } from "../../types/postViewModel";
import { PostListPaginatedOutput } from "../../output/postsListPaginatedOutput";
import { PostsDocument } from "../../domain/posts.model";
import { LikeStatus } from "../../../likes/types/likeComments.enum";

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
          myStatus: LikeStatus || post.extendedLikesInfo.myStatus,
          newestLikes: newestLikes || [],
      }
      }),
    ),
  };
}
