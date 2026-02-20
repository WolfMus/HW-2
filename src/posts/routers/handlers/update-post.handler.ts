import { Response } from "express";
import { HttpStatus, RequestWithParamsAndBody } from "../../../core/types/types";
import { PostInputModel } from "../../dto/posts-input.dto";
import { postsRepository } from "../../repository/posts.repository";
import { blogsRepository } from "../../../blogs/repositories/blogs.repository";

export async function updatePostHandler (
      req: RequestWithParamsAndBody<{ id: string }, PostInputModel>,
      res: Response,
    ) {
      try {

        const blog = await blogsRepository.findById(req.body.blogId)
        if (!blog) {
          return res.sendStatus(HttpStatus.NotFound);
        }
        
        await postsRepository.update(req.params.id, req.body);
        
        return res.sendStatus(HttpStatus.NoContent);

      } catch (e: unknown) {
        res.sendStatus(HttpStatus.InternalServerError);
      }
    }