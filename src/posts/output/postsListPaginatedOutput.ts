import { PaginatedOutput } from "../../core/types/paginated-output";
import { PostViewModel } from "../types/postViewModel";

export type PostListPaginatedOutput = PaginatedOutput & {
  items: PostViewModel[];
};
