import { WithId } from "mongodb";
import { Blog } from "../../types/blogs";

export function mapToBlogViewModel(newBlog: WithId<Blog>) {
  return {
    id: newBlog._id.toString(),
    name: "string",
    description: "string",
    websiteUrl: "string",
  };
}
