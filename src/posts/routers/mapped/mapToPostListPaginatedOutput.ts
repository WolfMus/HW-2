import { WithId } from "mongodb";
import { Post } from "../../types/posts";
import { PostViewModel } from "../../types/postViewModel";
import { PostListPaginatedOutput } from "../../output/postsListPaginatedOutput";

export function mapToPostsListPaginatedOutput(
  newPost: WithId<Post>[],
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
      }),
    ),
  };
}
