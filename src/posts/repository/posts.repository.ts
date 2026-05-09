import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";
import { injectable } from "inversify";
import { PostsDocument, PostsModel } from "../domain/posts.model";
@injectable()
export class PostsRepository {
  
  async create(post: PostsDocument): Promise<PostsDocument> {
    post.save();
    return post;
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

  async findById(id: string): Promise<PostsDocument> {
    const post = await PostsModel.findById(id)
    if (!post) {
      throw new RepositoryNotFoundError("Post not found", "id")
    }
    return post;
  }

  async isExist(id: string): Promise<void> {
    const post = await PostsModel.findById(id)
    if (!post) {
      throw new RepositoryNotFoundError("Post not found", "id")
    }
    return;
  }
}
