import { WithId } from "mongodb";
import { Blog } from "../../types/blogs.type";
import { BlogViewModel } from "../../types/blogViewModel.type";

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
