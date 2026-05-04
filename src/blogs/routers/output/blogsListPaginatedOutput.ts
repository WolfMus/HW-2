import { PaginatedOutput } from "../../../core/types/paginated-output";
import { BlogViewModel } from "../../types/blogViewModel.type";

export type BlogsListPaginatedOutput = PaginatedOutput & {
  items: BlogViewModel[];
};
