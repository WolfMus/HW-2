import { BlogViewModel } from "../../types/blogViewModel.type";
import { BlogsDocument } from "../../domain/blogs.model";

export function mapToBlogViewModel(newBlog: BlogsDocument): BlogViewModel {
  return {
    id: newBlog._id.toString(),
    name: newBlog.name,
    description: newBlog.description,
    websiteUrl: newBlog.websiteUrl,
    createdAt: newBlog.createdAt,
    isMembership: newBlog.isMembership,
  };
}
