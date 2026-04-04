import { UUID } from "crypto";

export type RefreshToken = {
    jti: UUID,
    sub: string,
    iat: number,
    exp: number,
}