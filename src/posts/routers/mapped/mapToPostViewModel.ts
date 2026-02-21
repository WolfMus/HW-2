import { WithId } from "mongodb";
import { PostViewModel } from "../../types/postViewModel";
import { Post } from "../../types/posts";

export function mapToPostViewModel(post: WithId<Post>): PostViewModel {
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
    }
}  