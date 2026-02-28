import { WithId } from "mongodb";
import { Post } from "../../types/posts";
import { PostViewModel } from "../../types/postViewModel";
import { PostListPaginatedOutput } from "../../output/postsListPaginatedOutput";

export function mapToPostsListPaginatedOutput(
  newPost: WithId<Post>[],
  meta: {
    pageNumber: number;
    pageSize: number;
    totalCount: number;
  },
): PostListPaginatedOutput {
  return {
    meta: {
      pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
      page: meta.pageNumber,
      pageSize: meta.pageSize,
      totalCount: meta.totalCount,
    },
    data: newPost.map(
      (post): PostViewModel => ({
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
      }),
    ),
  };
}
