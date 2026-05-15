import "reflect-metadata";
import { matchedData } from "express-validator";
import { BlogsQueryDtoInput } from "../input/blogs-query.input";
import { setDefaultSortAndPaginationIfNotExist } from "../../core/heplers/set-default-sort-and-pagination";
import { mapToBlogsListPaginatedOutput } from "./mappers/mapToBlogsListPaginatedOutput";
import {
  HttpStatus,
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithParamsAndUserId,
} from "../../core/types/types";
import { Request, Response } from "express";
import { errorsHandler } from "../../core/errors/errors.handler";
import { BlogsService } from "../application/blogs.service";
import { mapToBlogViewModel } from "./mappers/mapToBlogViewModel";
import { PostsQueryDtoInput } from "../../posts/input/post-query.input";
import { PostsService } from "../../posts/application/posts-service";
import { CreateBlogDto } from "../types/createBlogDto.type";
import { inject, injectable } from "inversify";
import { CreatePostDto } from "../../posts/types/createPostsDto.type";
import { PostInputForBlogModel } from "../../posts/dto/post-input-for-blog.dto";
import { IdType } from "../../core/types/id";

@injectable()
export class BlogsController {

  constructor(
    @inject(BlogsService) protected blogsService: BlogsService, 
    @inject(PostsService) protected postsService: PostsService
  ) {}

  async getBlogList(req: Request, res: Response) {
    try {
      const sanitizedQuery = matchedData(req, {
        includeOptionals: true,
      }) as BlogsQueryDtoInput;
      const queryInput = setDefaultSortAndPaginationIfNotExist(sanitizedQuery);

      const { items, totalCount } = await this.blogsService.findAll(queryInput);
      const blogsListOutput = mapToBlogsListPaginatedOutput(items, {
        pageNumber: queryInput.pageNumber,
        pageSize: queryInput.pageSize,
        totalCount,
      });

      res.status(HttpStatus.Ok).send(blogsListOutput);
    } catch (e: unknown) {
      console.error(e)
      errorsHandler(e, res);
    }
  }

  async getBlog(req: RequestWithParams<{ id: string }>, res: Response) {
    try {
      const id = req.params.id;

      const blog = await this.blogsService.findById(id);
      return res.status(HttpStatus.Ok).send(mapToBlogViewModel(blog));
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async getPostListForBlog(req: RequestWithParamsAndUserId<{ id: string }, IdType>, res: Response) {
    try {
      const blogId = req.params.id;
      const userId = req.user?.id;
      console.log(userId);

      await this.blogsService.findById(blogId);
      
      const sanitizedQuery = matchedData(req, { includeOptionals: true }) as PostsQueryDtoInput;
      const queryInput = setDefaultSortAndPaginationIfNotExist(sanitizedQuery);
      
      const postListPaginatedOutput = await this.postsService.findByBlogId(blogId, queryInput, userId);

      res.status(HttpStatus.Ok).send(postListPaginatedOutput);
    } catch (e) {
      errorsHandler(e, res);
    }
  }

  async createBlog(req: RequestWithBody<CreateBlogDto>, res: Response) {
    try {
      const blogsId = await this.blogsService.create(req.body);
      const blog = await this.blogsService.findById(blogsId);
      const blogToViewModel = mapToBlogViewModel(blog);

      res.status(HttpStatus.Created).send(blogToViewModel);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async createPostForBlog(
    req: RequestWithParamsAndBody<{ id: string }, PostInputForBlogModel>,
    res: Response,
  ) {
    try {
      const blogId = req.params.id;
      const postInputDto = req.body;
      const createPostDto: CreatePostDto = {
        ...postInputDto,
        blogId,
      }

      const blog = await this.blogsService.findByIdinViewModel(blogId);

      const createdPost = await this.postsService.createForBlog(createPostDto, blog.name);

      res.status(HttpStatus.Created).send(createdPost);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async updateBlog(
    req: RequestWithParamsAndBody<{ id: string }, CreateBlogDto>,
    res: Response,
  ) {
    try {
      const id = req.params.id;
      const body = req.body;

      await this.blogsService.update(id, body);
      res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async deleteBlog(req: RequestWithParams<{ id: string }>, res: Response) {
    try {
      const id = req.params.id;
      
      await this.blogsService.delete(id);
      return res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }
}
