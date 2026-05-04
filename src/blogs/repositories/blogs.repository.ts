import { CreateBlogDto } from "../types/createBlogDto.type";
import { ObjectId } from "mongodb";
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";
import { injectable } from "inversify";
import { BlogsDocument, BlogsModel } from "../models/blogs.schema";

@injectable()
export class BlogsRepository {
  async create(blog: BlogsDocument): Promise<string> {
    blog.save();
    return blog._id.toString();
    // const insertResult = await BlogsModel.insertOne(blog);

    // console.log("blogs id: ", insertResult._id.toString())
    // console.log(insertResult.toJSON())

    // return insertResult._id.toString()
  }

  async update(id: string, dto: CreateBlogDto): Promise<void> {
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
