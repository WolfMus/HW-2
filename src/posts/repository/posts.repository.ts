import { ObjectId, WithId } from "mongodb";
import { postsCollection } from "../../db/mongo.db";
import { PostInputModel } from "../dto/posts-input.dto";
import { Post } from "../types/posts";

export const postsRepository = {
  async findAll(): Promise<WithId<Post>[]> {
    return postsCollection.find().toArray();
  },

  async findById(id: string): Promise<WithId<Post> | null> {
    return await postsCollection.findOne({_id: new ObjectId(id)});
  },

  async create(newPost: Post): Promise<WithId<Post>> {
    const createdPost = await postsCollection.insertOne(newPost);
    return {...newPost, _id: createdPost.insertedId};
  },

  async update(id: string, body: PostInputModel): Promise<void> {
     
    const updatedPost = await postsCollection.updateOne(
      {_id: new ObjectId(id)},
      {
        $set: {
          title: body.title,
          shortDescription: body.shortDescription,
          content: body.content,
          blogId: body.blogId
        }
      } )
      if (updatedPost.matchedCount < 1) {
        throw new Error('Post not exist')
      }
    return;
  },

  async delete(id: string): Promise<void> {
    const deletedPost = await postsCollection.deleteOne({_id: new ObjectId(id)})
    if (deletedPost.deletedCount < 1) {
      throw new Error('Post not exist')
    }
    return
  },
};
