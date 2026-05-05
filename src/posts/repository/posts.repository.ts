import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";
import { injectable } from "inversify";
import { PostsDocument, PostsModel } from "../models/posts.schema";
@injectable()
export class PostsRepository {
  
  async save(post: PostsDocument): Promise<string> {
    post.save();
    return post._id.toString();
  }

  async update(post: PostsDocument): Promise<void> {
    post.save();
  }

  // async update(id: string, body: CreatePostDto): Promise<void> {
  //   const updatedPost = await PostsModel.updateOne(
  //     { _id: new ObjectId(id) },
  //     {
  //       $set: {
  //         title: body.title,
  //         shortDescription: body.shortDescription,
  //         content: body.content,
  //         blogId: body.blogId,
  //       },
  //     },
  //   );
  //   if (updatedPost.matchedCount < 1) {
  //     throw new RepositoryNotFoundError("Post id not found", "id");
  //   }
  //   return;
  // }

  async delete(id: string): Promise<void> {
    const deletedPost = await PostsModel.deleteOne({
      _id: id,
    });
    if (deletedPost.deletedCount < 1) {
      throw new RepositoryNotFoundError("Post id not found", "id");
    }
    return;
  }
}
