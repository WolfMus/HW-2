import { WithId } from "mongodb";
import { Post } from "../../types/posts";
import { PostViewModel } from "../../types/postViewModel";

export function mapToPostViewModel(post: WithId<Post>): PostViewModel {
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
    }
}  