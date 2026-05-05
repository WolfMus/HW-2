import { Request, Response } from "express";
import { errorsHandler } from "../../core/errors/errors.handler";
import {
  HttpStatus,
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithParamsAndBodyAndUserId,
  RequestWithParamsAndUserId,
} from "../../core/types/types";
import { matchedData } from "express-validator";
import { setDefaultSortAndPaginationIfNotExist } from "../../core/heplers/set-default-sort-and-pagination";
import { PostsQueryDtoInput } from "../input/post-query.input";
import { mapToPostsListPaginatedOutput } from "./mapped/mapToPostListPaginatedOutput";
import { PostsService } from "../application/posts-service";
import { mapToPostViewModel } from "./mapped/mapToPostViewModel";
import { CreatePostDto } from "../types/createPostsDto.type";
import { BlogsService } from "../../blogs/application/blogs.service";
import { CommentQueryDtoInput } from "../../comments/types/commentQueryDtoInput";
import { Post } from "../types/posts";
import { IdType } from "../../core/types/id";
import { CommentsService } from "../../comments/application/comments.service";
import { inject, injectable } from "inversify";

@injectable()
export class PostsController {

  constructor(
    @inject(PostsService) protected postsService: PostsService,
    @inject(BlogsService) protected blogsService: BlogsService,
    @inject(CommentsService) protected commentsService: CommentsService,
  ) {}

  async getPostList(req: Request, res: Response) {
    try {
      const sanitizedQuery = matchedData(req, {
        includeOptionals: true,
      }) as PostsQueryDtoInput;
      const queryInput = setDefaultSortAndPaginationIfNotExist(sanitizedQuery);

      const { items, totalCount } = await this.postsService.findAll(queryInput);
      const postsListOutput = mapToPostsListPaginatedOutput(items, {
        pageNumber: queryInput.pageNumber,
        pageSize: queryInput.pageSize,
        totalCount,
      });

      return res.status(HttpStatus.Ok).send(postsListOutput);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async getPost(req: RequestWithParams<{ id: string }>, res: Response) {
    try {
      const post = await this.postsService.findById(req.params.id);
      const postToViewModel = mapToPostViewModel(post);

      return res.status(HttpStatus.Ok).send(postToViewModel);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async createPost(req: RequestWithBody<CreatePostDto>, res: Response) {
    try {
      const postDto = req.body;
      const blog = await this.blogsService.findById(req.body.blogId);

      const createdPostId = await this.postsService.create(postDto, blog.name);
      const post = await this.postsService.findById(createdPostId);
      const postToViewModel = mapToPostViewModel(post);

      res.status(HttpStatus.Created).send(postToViewModel);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async updatePost(
    req: RequestWithParamsAndBody<{ id: string }, Post>,
    res: Response,
  ) {
    try {
      await this.blogsService.findById(req.body.blogId);
      await this.postsService.update(req.params.id, req.body);

      res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async deletePost(req: RequestWithParams<{ id: string }>, res: Response) {
    try {
      await this.postsService.delete(req.params.id);
      res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async createComment(
    req: RequestWithParamsAndBodyAndUserId<
      { id: string },
      { content: string },
      IdType
    >,
    res: Response,
  ) {
    try {
      const postId = req.params.id;
      const content = req.body.content;
      const userId = req.user.id;

      await this.postsService.findById(postId);

      const newCommentId = await this.commentsService.create(
        content,
        postId,
        userId,
      );

      const comment = await this.commentsService.getById(newCommentId, userId);

      res.status(HttpStatus.Created).send(comment);
    } catch (e) {
      errorsHandler(e, res);
    }
  }

  async getListOfCommentsById(req: RequestWithParamsAndUserId<{ id: string }, IdType>, res: Response) {
    try {
      const id = req.params.id;
      const userId = req.user?.id;

      await this.postsService.findById(id);

      const sanitizedQuery = matchedData(req, {
        includeOptionals: true,
      }) as CommentQueryDtoInput;
      const queryInput = setDefaultSortAndPaginationIfNotExist(sanitizedQuery);

      const comments = await this.commentsService.findByPostId(id, queryInput, userId);
      res.status(HttpStatus.Ok).send(comments);
    } catch (e) {
      errorsHandler(e, res);
    }
  }
}
