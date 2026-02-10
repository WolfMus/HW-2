import { FieldErrorMessage } from "../../core/types/validationError";
import { PostInputModel } from "../dto/posts-input.dto";

export const postInputDtoValidation = (
  data: PostInputModel,
): FieldErrorMessage[] => {
  const errors = [];

  if (
    !data.title ||
    typeof data.title !== "string" ||
    data.title.trim().length > 30
  ) {
    errors.push({
      message: "incorrect title input",
      field: "title",
    });
  }

  if (
    !data.shortDescription ||
    typeof data.shortDescription !== "string" ||
    data.shortDescription.trim().length > 100
  ) {
    errors.push({
      message: "Incorrect shertDescription input",
      field: "shortDescription",
    });
  }

  if (
    !data.content ||
    typeof data.content !== "string" ||
    data.content.trim().length > 1000
  ) {
    errors.push({
      message: "Incorrect content input",
      field: "content",
    });
  }

  if (!data.blogId || typeof data.blogId !== "string") {
    errors.push({
      message: "Incorrect blogId input",
      field: "blogId",
    });
  }

  return errors;
};
