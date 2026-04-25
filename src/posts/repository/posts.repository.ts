import { ObjectId } from "mongodb";
import { postsCollection } from "../../db/mongo.db";
import { PostInputModel } from "../dto/posts-input.dto";
import { Post } from "../types/posts";
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";

export class PostsRepository {
  async create(newPost: Post): Promise<string> {
    const createdPost = await postsCollection.insertOne(newPost);
    return createdPost.insertedId.toString();
  }

  async update(id: string, body: PostInputModel): Promise<void> {
    const updatedPost = await postsCollection.updateOne(
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
    const deletedPost = await postsCollection.deleteOne({
      _id: new ObjectId(id),
    });
    if (deletedPost.deletedCount < 1) {
      throw new RepositoryNotFoundError("Post id not found", "id");
    }
    return;
  }
}
