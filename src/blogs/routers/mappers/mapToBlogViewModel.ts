import { WithId } from "mongodb";
import { Blog } from "../../types/blogs";
import { BlogViewModel } from "../../types/BlogViewModel";

export function mapToBlogViewModel(newBlog: WithId<Blog>): BlogViewModel {
  return {
    id: newBlog._id.toString(),
    name: newBlog.name,
    description: newBlog.description,
    websiteUrl: newBlog.websiteUrl,
    createdAt: newBlog.createdAt,
    isMembership: newBlog.isMembership,
  };
}
