import { PaginationAndSorting } from "../../core/types/pagination-and-sorting";
import { PostSortField } from "./post-sort-field";

export type PostsQueryDtoInput = PaginationAndSorting<PostSortField>;
