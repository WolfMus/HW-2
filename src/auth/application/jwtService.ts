import jwt from "jsonwebtoken"
import { SETTINGS } from "../../core/settings/settings"

export const jwtService = {

    async createToken(userId: string): Promise <string> {
        const token = jwt.sign(userId, SETTINGS.JWT_SECRET);

        return token.toString()
    },

    async decodeToken(token: string): Promise <string> {
        const decodedToken = jwt.decode(token);

        return decodedToken!.toString()
    }

}