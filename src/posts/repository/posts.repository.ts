import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";
import { injectable } from "inversify";
import { PostsDocument, PostsModel } from "../domain/posts.model";
@injectable()
export class PostsRepository {
  
  async create(post: PostsDocument): Promise<string> {
    post.save();
    return post._id.toString();
  }

  async save(post: PostsDocument): Promise<void> {
    post.save();
  }

  async delete(id: string): Promise<void> {
    const deletedPost = await PostsModel.deleteOne({ _id: id });
    if (deletedPost.deletedCount < 1) {
      throw new RepositoryNotFoundError("Post id not found", "id");
    }
    return;
  }
}
