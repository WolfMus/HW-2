import { FieldErrorMessage } from "../../core/types/validationError";
import { BlogInputModel } from "../dto/blog-input.dto";

const URL_REGEX =
  /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;

export const blogInputDtoValidation = (
  data: BlogInputModel,
): FieldErrorMessage[] => {
  const errors = [];

  if (
    !data.name ||
    typeof data.name !== "string" ||
    data.name.trim().length > 15
  ) {
    errors.push({
      message: "Name has incorrect value",
      field: "name",
    });
  }

  if (
    !data.description ||
    typeof data.description !== "string" ||
    data.description.trim().length > 500
  ) {
    errors.push({
      message: "Description has incorrect value",
      field: "Description",
    });
  }

  if (
    !data.websiteUrl ||
    typeof data.websiteUrl !== "string" ||
    data.websiteUrl.length > 100 ||
    !URL_REGEX.test(data.websiteUrl) 
  ) {
    errors.push({
      message: "websiteUrl has incorrect value",
      field: "websiteUrl",
    });
  }

  return errors;
};
