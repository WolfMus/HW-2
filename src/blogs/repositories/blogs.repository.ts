import { BlogViewModel } from "../types/blogs";
import { db } from "../../db/in-memory.db";
import { BlogInputModel } from "../dto/blog-input.dto";
import { blogsCollection } from "../../db/mongo.db";
import { WithId } from "mongodb";

export const blogsRepository = {

    async findAll(): Promise<BlogViewModel[]> {
        return blogsCollection.find().toArray();
    },

    async findById(id: string): Promise<WithId<BlogViewModel> | null> {
        const blog = db.blogs.find((b) => b.id === id);
        if (!blog) {
            throw new Error("Blog not exist");
        }
        return blog;
    },

    async create(newBlog: BlogViewModel): Promise<BlogViewModel> {
        db.blogs.push(newBlog);

        return newBlog
    },

    async update(id: string, dto: BlogInputModel): Promise<void> {
        const updatedBlog = db.blogs.find((b) => b.id === id);

        if (!updatedBlog) {
            throw new Error("Blog not exist");
        }

        updatedBlog.name = dto.name;
        updatedBlog.description = dto.description;
        updatedBlog.websiteUrl = dto.websiteUrl;

        return;
    },

    async delete(id: string): Promise<void> {
        db.blogs = db.blogs.filter((b) => b.id !== id);

        return
    }
}