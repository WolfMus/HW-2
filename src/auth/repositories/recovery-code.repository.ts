import { BadRequestError } from "../../core/errors/bad-request.error";
import { injectable } from "inversify";
import { recoveryCodeModel } from "../models/recoveryCode.Schema";

@injectable()
export class RecoveryCodeRepository {
    async create(code: string, date: Date, email: string): Promise<void> {
        await recoveryCodeModel.insertOne({recoveryCode: code, expirationDate: date, email: email});
        return;
    }

    async find(code: string): Promise<string> {
        const recoveryCode = await recoveryCodeModel.findOne({recoveryCode: code});

        if (!recoveryCode) {
            throw new BadRequestError("Recovery code not found", "recoveryCode");
        }

        return recoveryCode.email;
    }
}