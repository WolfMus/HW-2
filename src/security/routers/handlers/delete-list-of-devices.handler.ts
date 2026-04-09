import { Response } from "express";
import { HttpStatus, RequestWithUserId } from "../../../core/types/types";
import { IdType } from "../../../core/types/id";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { jwtService } from "../../../auth/application/jwtService";
import { securityDeviceService } from "../../application/securityDevice.service";

export async function deleteAllDevicesHandler(req: RequestWithUserId<IdType>, res: Response) {
    try {
        const refreshToken = await jwtService.verifyRefreshToken(req.cookies.refreshToken);

        await securityDeviceService.deleteMany(req.user.id, refreshToken!.deviceId);

        res.sendStatus(HttpStatus.NoContent);
    } catch (e) {
        errorsHandler(e, res);
    }
}