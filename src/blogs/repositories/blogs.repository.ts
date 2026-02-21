import { Blog } from "../types/blogs";
import { BlogInputModel } from "../dto/blog-input.dto";
import { blogsCollection } from "../../db/mongo.db";
import { ObjectId, WithId } from "mongodb";

export const blogsRepository = {
  async findAll(): Promise<WithId<Blog>[]> {
    return blogsCollection.find().toArray();
  },

  async findById(id: string): Promise<WithId<Blog> | null> {
    return await blogsCollection.findOne({ _id: new ObjectId(id) });
  },

  async create(newBlog: Blog): Promise<WithId<Blog>> {
    const insertResult = await blogsCollection.insertOne(newBlog);

    return { ...newBlog, _id: insertResult.insertedId };
  },

  async update(id: string, dto: BlogInputModel): Promise<void> {
    const updatedResult = await blogsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: dto.name,
          description: dto.description,
          websiteUrl: dto.websiteUrl,
        },
      },
    );

    if (updatedResult.matchedCount < 1) {
        throw new Error ("Blog not exist");
    }

    return;
  },

  async delete(id: string): Promise<void> {
    const deletedResult = await blogsCollection.deleteOne({_id: new ObjectId(id)});

    if (deletedResult.deletedCount < 1) {
        throw new Error ("Blogs wasn't deleted. Blog not exist")
    }
    return;
  },
};
