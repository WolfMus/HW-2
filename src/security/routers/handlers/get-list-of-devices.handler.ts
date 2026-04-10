import { Response } from "express";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { IdType } from "../../../core/types/id";
import { HttpStatus, RequestWithUserId } from "../../../core/types/types";
import { securityDeviceService } from "../../application/securityDevice.service";

export async function getDevicesListHandler(
  req: RequestWithUserId<IdType>,
  res: Response,
) {
  try {
    const userId = req.user.id;
    const listOfDevices = await securityDeviceService.findMany(userId);
    res.status(HttpStatus.Ok).send(listOfDevices);
  } catch (e) {
    errorsHandler(e, res);
  }
}
