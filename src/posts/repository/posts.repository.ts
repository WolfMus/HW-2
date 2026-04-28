import { ObjectId } from "mongodb";
import { PostInputModel } from "../dto/posts-input.dto";
import { Post } from "../types/posts";
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";
import { injectable } from "inversify";
import { PostsModel } from "../models/posts.schema";
@injectable()
export class PostsRepository {
  async create(newPost: Post): Promise<string> {
    const createdPost = await PostsModel.insertOne(newPost);
    return createdPost._id.toString();
  }

  async update(id: string, body: PostInputModel): Promise<void> {
    const updatedPost = await PostsModel.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title: body.title,
          shortDescription: body.shortDescription,
          content: body.content,
          blogId: body.blogId,
        },
      },
    );
    if (updatedPost.matchedCount < 1) {
      throw new RepositoryNotFoundError("Post id not found", "id");
    }
    return;
  }

  async delete(id: string): Promise<void> {
    const deletedPost = await PostsModel.deleteOne({
      _id: new ObjectId(id),
    });
    if (deletedPost.deletedCount < 1) {
      throw new RepositoryNotFoundError("Post id not found", "id");
    }
    return;
  }
}
