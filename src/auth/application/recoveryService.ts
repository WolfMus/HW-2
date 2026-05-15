import { RecoveryCodeRepository } from "../repositories/recovery-code.repository"
import { RecoveryCode } from "../types/recovery-code.type";
import { inject, injectable } from "inversify";

@injectable()
export class RecoveryService {
       constructor(
        @inject(RecoveryCodeRepository) protected recoveryCodeRepo: RecoveryCodeRepository
    ) {}

    async find(recoveryCode: string): Promise<RecoveryCode> {
        const recoveryCodeBody = await this.recoveryCodeRepo.find(recoveryCode);
        return {
            recoveryCode: recoveryCodeBody.recoveryCode,
            expirationDate: recoveryCodeBody.expirationDate,
            email: recoveryCodeBody.email
        }
    }
}