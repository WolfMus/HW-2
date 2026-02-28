import { PaginationAndSorting } from "../../core/types/pagination-and-sorting"
import { BlogSortField } from "./blog-sort-field"

export type BlogsQueryDtoInput = PaginationAndSorting<BlogSortField> & Partial<{
    searchNameTerm: string,
}>