import { PaginatedOutput } from "../../core/types/paginated-output";
import { PostViewModel } from "../types/postViewModel";

export type PostListPaginatedOutput = {
    meta: PaginatedOutput,
    data: PostViewModel[],
}