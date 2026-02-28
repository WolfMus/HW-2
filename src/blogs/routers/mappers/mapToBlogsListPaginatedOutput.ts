import { WithId } from "mongodb";
import { Blog } from "../../types/blogs";
import { BlogViewModel } from "../../types/BlogViewModel";
import { BlogsListPaginatedOutput } from "../output/blogsListPaginatedOutput";

export function mapToBlogsListPaginatedOutput(
  newBlog: WithId<Blog>[],
  params: {
    pageNumber: number,
    pageSize: number,
    totalCount: number,
  }
): BlogsListPaginatedOutput {
  return {
    pagesCount: Math.ceil(params.totalCount / params.pageSize),
    page: params.pageNumber,
    pageSize: params.pageSize,
    totalCount: params.totalCount,
    items: newBlog.map(
      (blog): BlogViewModel => ({
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership,
      }),
    ),
  };
}
