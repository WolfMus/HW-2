import mongoose, { HydratedDocument, Model, model } from "mongoose";
import { Blog } from "../types/blogs.type";
import { CreateBlogDto } from "../types/createBlogDto.type";
import { BadRequestError } from "../../core/errors/bad-request.error";

interface BlogsMethods {
  update(dto: CreateBlogDto): void;
}

type BlogsStatics = typeof BlogsEntity;
type BlogsModel = Model<Blog, unknown, BlogsMethods> & BlogsStatics;
export type BlogsDocument = HydratedDocument<Blog, BlogsMethods>;

const blogsScheme = new mongoose.Schema<Blog, BlogsModel, BlogsMethods>({
  name: { type: String, required: true, maxLength: 15 },
  description: { type: String, required: true, maxLength: 500 },
  websiteUrl: { type: String, required: true, maxLength: 100 },
  createdAt: { type: Date, required: true },
  isMembership: { type: Boolean, required: true },
});

class BlogsEntity {
  private constructor(
    public name: string,
    public description: string,
    public websiteUrl: string,
    public createdAt: Date,
    public isMembership: boolean,
  ) {}

  static createBlog(dto: CreateBlogDto) {
    const blog = new BlogsModel({ ...dto });
    blog.createdAt = new Date();
    blog.isMembership = false;

    return blog;
  }

  async update(dto: CreateBlogDto): Promise<void> {

    if ( !dto.name || dto.name.length < 1 || dto.name.length > 15 ) {
      throw new BadRequestError("Invalid name", "name");
    }
    if ( !dto.description || dto.description.length < 1 || dto.description.length > 500 ) {
      throw new BadRequestError("Invalid description", "description");
    }
    const regExpUrl = RegExp("^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*\\/?$");
    if (!dto.websiteUrl ||!regExpUrl.test(dto.websiteUrl) || dto.websiteUrl.length > 100) {
      throw new BadRequestError("Invalid websiteUrl", "websiteUrl");
    }

    if (dto.name && dto.description && dto.websiteUrl) {
      this.name = dto.name;
      this.description = dto.description;
      this.websiteUrl = dto.websiteUrl;
    }
    return;
  }
}

blogsScheme.loadClass(BlogsEntity);

export const BlogsModel = model<Blog, BlogsModel>("Blogs", blogsScheme);
