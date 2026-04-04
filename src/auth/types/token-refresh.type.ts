import { UUID } from "crypto";

export type RefreshToken = {
    jit: UUID,
    sub: string,
    iat: number,
    exp: number,
}