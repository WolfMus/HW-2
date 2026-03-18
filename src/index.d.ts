import { IdType } from "./core/types/id";

declare global {
    namespace Express {
        export interface Request {
            user: IdType
        }
    }
}