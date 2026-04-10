import { UUID } from "crypto";

export type RefreshToken = {
    sub: string,
    deviceId: UUID,
    iat: number,
    exp: number,
}