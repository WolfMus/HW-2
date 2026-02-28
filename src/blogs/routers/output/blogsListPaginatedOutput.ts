import { PaginatedOutput } from "../../../core/types/paginated-output";
import { BlogViewModel } from "../../types/BlogViewModel";

export type BlogsListPaginatedOutput = PaginatedOutput & {
    items: BlogViewModel[],
}