import request from "supertest";
import { BlogInputModel } from "../../../src/blogs/dto/blog-input.dto";
import {Express} from 'express'
import { getBlogsDto } from "./get-blogs-dto";
import { BLOGS_PATH } from "../../../src/core/paths/paths";
import { generateAdminAuthToken } from "../generate-admin-auth-token";
import { HttpStatus } from "../../../src/core/types/types";
import { Blog } from "../../../src/blogs/types/blogs";
import { BlogViewModel } from "../../../src/blogs/types/BlogViewModel";

const adminToken = generateAdminAuthToken();

export async function createBlog(app: Express, blogsDto?: BlogInputModel): Promise<BlogViewModel> {
    const defaultBlogsData: BlogInputModel = getBlogsDto();
    const testBlogsData: BlogInputModel = {...defaultBlogsData, ...blogsDto};

    const createResponse = await request(app)
        .post(`${BLOGS_PATH}`)
        .set("Authorization", adminToken)
        .send(testBlogsData)
        .expect(HttpStatus.Created)
    
    return createResponse.body
}