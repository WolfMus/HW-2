import {Express} from 'express'
import request from 'supertest'
import { BLOGS_PATH } from '../../../src/core/paths/paths'
import { generateAdminAuthToken } from '../generate-admin-auth-token'
import { HttpStatus } from '../../../src/core/types/types'
import {BlogViewModel} from "../../../src/blogs/types/BlogViewModel"

const adminToken = generateAdminAuthToken();

export async function getBlogById(app: Express, id: string): Promise<BlogViewModel> {
    
    const getResponse = await request(app)
        .get(`${BLOGS_PATH}/${id}`)
        .expect(HttpStatus.Ok)

    return getResponse.body
}