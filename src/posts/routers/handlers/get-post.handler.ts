import { Response } from "express";
import { HttpStatus, RequestWithParams } from "../../../core/types/types";
import { postsRepository } from "../../repository/posts.repository";
import { createErrorMessage } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { mapToPostViewModel } from "../mapped/mapToPostViewModel";

export async function getPostHandler(
  req: RequestWithParams<{ id: string }>,
  res: Response,
) {
  try {
    const id = req.params.id;
    const post = await postsRepository.findById(id);

    if (!post) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessage([{ field: "id", message: "post not found" }])
        );

      return;
    }

    const postToViewModel = mapToPostViewModel(post);

    return res.status(HttpStatus.Ok).send(postToViewModel);
  } catch (e: unknown) {
    return res.sendStatus(HttpStatus.InternalServerError);
  }
}
