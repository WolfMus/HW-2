import express from "express";
import { setupApp } from "../../../src/setup-app";
import { generateAdminAuthToken } from "../../utils/generate-admin-auth-token";
import { SETTINGS } from "../../../src/core/settings/settings";
import { clearDb } from "../../utils/clear-db";
import { runDb } from "../../../src/db/mongo.db";
import { createPost } from "../../utils/posts/create-post";
import { createPostsDto } from "../../utils/posts/create-post-dto";
import { createBlog } from "../../utils/blogs/create-blog";
import { Post } from "../../../src/posts/types/posts";
import { describe, beforeAll, afterAll, it, expect } from '@jest/globals';

describe("Comments API", () => {
    const app = express();
    setupApp(app);

    const adminToken = generateAdminAuthToken();

    beforeAll(async() => {
        await runDb(SETTINGS.MONGO_URL);
        await clearDb(app);
    });

    it("should create comment; POST /posts, POST /post/:id/comments", async () => {
        const blog = await createBlog(app);
        const newPost: Post = {
              ...createPostsDto(),
              blogId: blog.id,
              blogName: blog.name,
              createdAt: new Date(),
            };
        const post = await createPost(app, newPost)
    })
})