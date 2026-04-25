import { matchedData } from "express-validator";
import { BlogsQueryDtoInput } from "../input/blogs-query.input";
import { setDefaultSortAndPaginationIfNotExist } from "../../core/heplers/set-default-sort-and-pagination";
import { mapToBlogsListPaginatedOutput } from "./mappers/mapToBlogsListPaginatedOutput";
import {
  HttpStatus,
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
} from "../../core/types/types";
import { Request, Response } from "express";
import { errorsHandler } from "../../core/errors/errors.handler";
import { BlogsService } from "../application/blogs.service";
import { mapToBlogViewModel } from "./mappers/mapToBlogViewModel";
import { PostsQueryDtoInput } from "../../posts/input/post-query.input";
import { mapToPostsListPaginatedOutput } from "../../posts/routers/mapped/mapToPostListPaginatedOutput";
import { PostsService } from "../../posts/application/posts-service";
import { BlogInputModel } from "../dto/blog-input.dto";
import { PostInputForBlogModel } from "../../posts/dto/post-input-for-blog.dto";
import { mapToPostViewModel } from "../../posts/routers/mapped/mapToPostViewModel";

export class BlogsController {
  private blogsService: BlogsService;
  private postsService: PostsService;

  constructor(blogsService: BlogsService, postsService: PostsService) {
    this.blogsService = blogsService;
    this.postsService = postsService;
  }

  async getBlogList(req: Request, res: Response) {
    try {
      console.log("Пришел в getBlogList")
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

  async getPostListForBlog(req: Request<{ id: string }>, res: Response) {
    try {
      const id = req.params.id;
      await this.blogsService.findById(id);

      const sanitizedQuery = matchedData(req, {
        includeOptionals: true,
      }) as PostsQueryDtoInput;
      const queryInput = setDefaultSortAndPaginationIfNotExist(sanitizedQuery);

      const { items, totalCount } = await this.postsService.findByBlogId(
        id,
        queryInput,
      );
      const postsListOutput = mapToPostsListPaginatedOutput(items, {
        pageNumber: queryInput.pageNumber,
        pageSize: queryInput.pageSize,
        totalCount,
      });

      res.status(HttpStatus.Ok).send(postsListOutput);
    } catch (e) {
      errorsHandler(e, res);
    }
  }

  async createBlog(req: RequestWithBody<BlogInputModel>, res: Response) {
    try {
      const blogsId = await this.blogsService.create(req.body);
      const createdBlog = await this.blogsService.findById(blogsId);

      const blogToViewModel = mapToBlogViewModel(createdBlog);

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
      const id = req.params.id;
      const blog = await this.blogsService.findById(id);

      const createdPostId = await this.postsService.createForBlog(
        req.body,
        blog,
      );
      const post = await this.postsService.findById(createdPostId);
      const postToViewModel = mapToPostViewModel(post);

      res.status(HttpStatus.Created).send(postToViewModel);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async updateBlog(
    req: RequestWithParamsAndBody<{ id: string }, BlogInputModel>,
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
