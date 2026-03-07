import { BlogInputModel } from "../../../src/blogs/dto/blog-input.dto";

export function getBlogsDto(): BlogInputModel {
  return {
    name: "Blog's Name",
    description: "Blog's Description",
    websiteUrl:
      "https://Pc9DLvZWb1vvGQqhu2fLAqzhaZLURIWHsXj2XH7IYhkOaMVD-N2Jd3qR1gAuv33H.by",
  };
}
