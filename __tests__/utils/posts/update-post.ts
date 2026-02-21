import {Express} from 'express'
import request from 'supertest'
import { PostInputModel } from '../../../src/posts/dto/posts-input.dto'
import { createPostsDto } from './create-post-dto'
import { POSTS_PATH } from '../../../src/core/paths/paths';
import { HttpStatus } from '../../../src/core/types/types';
import { generateAdminAuthToken } from '../generate-admin-auth-token';
import { PostViewModel } from '../../../src/posts/types/postViewModel';
import { Post } from '../../../src/posts/types/posts';

export async function updatePost(app: Express, id: string, postDto?: Post): Promise<PostViewModel> {
    const defaultPostData = createPostsDto();
    const testPostData = {...defaultPostData, ...postDto};
    console.log("---DATA RECIEVED IN UPDATE POST: ", testPostData)
    const updatePost = await request(app)
          .put(`${POSTS_PATH}/${id}`)
          .set("Authorization", generateAdminAuthToken())
          .send(testPostData)
          .expect(HttpStatus.NoContent);
    console.log("---UPDATED POST---", updatePost.body)
    return updatePost.body
}