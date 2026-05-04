import mongoose, { HydratedDocument, Model, model } from "mongoose";
import { Blog } from "../types/blogs.type";
import { CreateBlogDto } from "../types/createBlogDto.type";

interface BlogsMethods {
    /* 
        тут будет находиться описание методов
        пример:
            convertMoney(fromWalletId: string, toWalletId: string, amount: number): void;
            increaseWalletBalance(walletId: string, amount: number): void;
            decreaseWalletBalance(walletId: string, amount: number): void;
    */
}
type BlogsStatics = typeof BlogsEntity;
type BlogsModel = Model<Blog, {}, BlogsMethods & BlogsStatics>
export type BlogsDocument = HydratedDocument<Blog, BlogsMethods>

const blogsScheme = new mongoose.Schema<Blog, BlogsModel, BlogsStatics>({
    name: { type: String, required: true, maxLength: 15},
    description: { type: String, required: true, maxLength: 500},
    websiteUrl: { type: String, required: true, maxLength: 100},
    createdAt: {type: Date, required: true},
    isMembership: {type: Boolean, required: true},
})

class BlogsEntity {
    private constructor(
        public name: string,
        public description: string,
        public websiteUrl: string,
        public createdAt: Date,
        public isMemberShip: boolean,
    ) {}

    static create(dto: CreateBlogDto) {
        const blog = new BlogsModel({
            ...dto,
            createdAt: new Date(),
            isMembership: false
        })

        return blog
    }
}

blogsScheme.loadClass(BlogsEntity);

export const BlogsModel = model<Blog, BlogsModel>("Blogs", blogsScheme);