import { ObjectId, WithId } from "mongodb";
import { postsCollection } from "../../db/mongo.db";
import { PostInputModel } from "../dto/posts-input.dto";
import { Post } from "../types/posts";
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";
import { PostsQueryDtoInput } from "../input/post-query.input";

export const postsRepository = {
  async findAll(
    queryDto: PostsQueryDtoInput,
  ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryDto;

    const skip = (pageNumber - 1) * pageSize;

    const sortOrder = sortDirection === "asc" ? 1 : -1;

    const items = await postsCollection
      .find()
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCount = await postsCollection.countDocuments();

    return { items, totalCount };
  },

  async findById(id: string): Promise<WithId<Post>> {
    const post = await postsCollection.findOne({ _id: new ObjectId(id) });
    if (!post) {
      throw new RepositoryNotFoundError("Post id not found", "id");
    }
    return post;
  },

  async create(newPost: Post): Promise<WithId<Post>> {
    const createdPost = await postsCollection.insertOne(newPost);
    return { ...newPost, _id: createdPost.insertedId };
  },

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
  },

  async delete(id: string): Promise<void> {
    const deletedPost = await postsCollection.deleteOne({
      _id: new ObjectId(id),
    });
    if (deletedPost.deletedCount < 1) {
      throw new RepositoryNotFoundError("Post id not found", "id");
    }
    return;
  },
};
