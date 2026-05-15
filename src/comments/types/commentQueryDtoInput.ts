import { PaginationAndSorting } from "../../core/types/pagination-and-sorting";
import { CommentSortField } from "./commentSortField";

export type CommentQueryDtoInput = PaginationAndSorting<CommentSortField>;
