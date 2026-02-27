import { WithId } from "mongodb";
import { Blog } from "../../types/blogs";
import { BlogViewModel } from "../../types/BlogViewModel";
import { BlogsListPaginatedOutput } from "../output/blogsListPaginatedOutput";

export function mapToBlogsListPaginatedOutput(
  newBlog: WithId<Blog>[],
  meta: {
    pageNumber: number;
    pageSize: number;
    totalCount: number;
  },
): BlogsListPaginatedOutput {
  return {
    meta: {
      pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
      page: meta.pageNumber,
      pageSize: meta.pageSize,
      totalCount: meta.totalCount,
    },
    data: newBlog.map(
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
