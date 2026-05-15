import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";
import { injectable } from "inversify";
import { BlogsDocument, BlogsModel } from "../domain/blogs.model";

@injectable()
export class BlogsRepository {
  async create(blog: BlogsDocument): Promise<string> {
    await blog.save();
    return blog._id.toString();
  }

  async save(blog: BlogsDocument): Promise<void> {
    blog.save();
  }

  async delete(id: string): Promise<void> {
    const deletedResult = await BlogsModel.deleteOne({
      _id: id,
    });

    if (deletedResult.deletedCount < 1) {
      throw new RepositoryNotFoundError(
        "Blog wasn't deleted. Blog not exist",
        "id",
      );
    }
    return;
  }
}
