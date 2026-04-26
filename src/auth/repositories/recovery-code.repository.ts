import { WithId } from "mongodb";
import { BadRequestError } from "../../core/errors/bad-request.error";
import { recoveryCodeCollection } from "../../db/mongo.db";
import { RecoveryCode } from "../types/recovery-code.type";
import { injectable } from "inversify";

@injectable()
export class RecoveryCodeRepository {
    async create(code: string, date: Date, email: string): Promise<void> {
        await recoveryCodeCollection.insertOne({recoveryCode: code, expirationDate: date, email: email});
        return;
    }

    async find(code: string): Promise<WithId<RecoveryCode>> {
        const recoveryCode = await recoveryCodeCollection.findOne({recoveryCode: code});

        if (!recoveryCode) {
            throw new BadRequestError("Recovery code not found", "recoveryCode");
        }

        return recoveryCode;
    }
}