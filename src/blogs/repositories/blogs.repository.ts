import { Blog } from "../types/blogs";
import { BlogInputModel } from "../dto/blog-input.dto";
import { ObjectId } from "mongodb";
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";
import { injectable } from "inversify";
import { BlogsModel } from "../models/blogs.scheme";

@injectable()
export class BlogsRepository {
  async create(newBlog: Blog): Promise<string> {
    const insertResult = await BlogsModel.insertOne(newBlog);

    console.log(insertResult._id.toString())

    return insertResult._id.toString()
  }

  async update(id: string, dto: BlogInputModel): Promise<void> {
    const updatedResult = await BlogsModel.updateOne(
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
      throw new RepositoryNotFoundError("Blog not found", "id");
    }

    return;
  }

  async delete(id: string): Promise<void> {
    const deletedResult = await BlogsModel.deleteOne({
      _id: new ObjectId(id),
    });

    if (deletedResult.deletedCount < 1) {
      throw new RepositoryNotFoundError(
        "Blogs wasn't deleted. Blog not exist",
        "id",
      );
    }
    return;
  }
}
