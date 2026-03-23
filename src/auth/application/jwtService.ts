import jwt from "jsonwebtoken"
import { SETTINGS } from "../../core/settings/settings"

export const jwtService = {

    async createToken(userId: string): Promise <string> {
        const token = jwt.sign({userId}, SETTINGS.JWT_SECRET);
        return token
    },

    async decodeToken(token: string): Promise <string> {
        const decodedToken = jwt.decode(token);
        return decodedToken!.toString()
    },

    async verifyToken(token: string): Promise <{userId: string} | null> {
        try {
            return jwt.verify(token, SETTINGS.JWT_SECRET) as {userId: string};
        } catch (error) {
            console.error("Token verify catch some error", error)
            return null
        }
    },
}