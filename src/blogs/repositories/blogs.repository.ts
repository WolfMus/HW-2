import { BlogViewModel } from "../types/blogs";
import { db } from "../../db/in-memory.db";
import { BlogInputModel } from "../dto/blog-input.dto";

export const blogsRepository = {

    findAll(): BlogViewModel[] {
        return db.blogs;
    },

    findById(reqId: string): BlogViewModel | null {
        return db.blogs.find((b) => b.id === reqId) ?? null;
    },

    create(newBlog: BlogViewModel): BlogViewModel {
        db.blogs.push(newBlog);

        return newBlog
    },

    update(id: string, dto: BlogInputModel): void {
        const updatedBlog = db.blogs.find((b) => b.id === id);

        if (!updatedBlog) {
            throw new Error("Blog not exist");
        }

        updatedBlog.name = dto.name;
        updatedBlog.description = dto.description;
        updatedBlog.websiteUrl = dto.websiteUrl;

        return;
    },

    delete(blogId: string): void {
        const initialLength = db.blogs.length;
        db.blogs = db.blogs.filter((b) => b.id !== blogId);

        if (initialLength === db.blogs.length) {
            throw new Error("Id not found");
        }

        return
    }
}