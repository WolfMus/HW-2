import { query } from "express-validator";

export const searchNameTermValidation = query('searchBlogNameTerm')
    .optional()
    .default(null)
