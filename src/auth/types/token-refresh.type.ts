import { UUID } from "crypto";

export type RefreshToken = {
    jti: UUID,
    sub: string,
    deviceId: UUID,
    iat: number,
    exp: number,
}