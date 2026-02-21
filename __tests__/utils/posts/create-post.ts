import {Express} from 'express'
import request from 'supertest'
import { PostInputModel } from "../../../src/posts/dto/posts-input.dto";
import { createPostsDto } from './create-post-dto';
import { POSTS_PATH } from '../../../src/core/paths/paths';
import { generateAdminAuthToken } from '../generate-admin-auth-token';
import { HttpStatus } from '../../../src/core/types/types';
import { PostViewModel } from '../../../src/posts/types/postViewModel';

export async function createPost(app: Express, postDto?: PostInputModel): Promise<PostViewModel> {
    const defaultPostData = createPostsDto();
    const testPostData = {...defaultPostData, ...postDto};

    const createPost = await request(app)
        .post(POSTS_PATH)
        .set("Authorization", generateAdminAuthToken())
        .send(testPostData)
        .expect(HttpStatus.Created)
    
    return createPost.body
}