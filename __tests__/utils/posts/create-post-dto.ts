import { PostInputModel } from "../../../src/posts/dto/posts-input.dto";

export function createPostsDto(): PostInputModel {
  return {
    title: "string",
    shortDescription: "string",
    content: "string",
    blogId: "string",
  };
}
