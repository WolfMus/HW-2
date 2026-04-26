import { RecoveryCodeRepository } from "../repositories/recovery-code.repository"
import { RecoveryCode } from "../types/recovery-code.type";

export class RecoveryService {
    private recoveryCodeRepo: RecoveryCodeRepository;

    constructor(recoveryCodeRepo: RecoveryCodeRepository) {
        this.recoveryCodeRepo = recoveryCodeRepo;
    }

    async find(recoveryCode: string): Promise<RecoveryCode> {
        const recoveryCodeBody = await this.recoveryCodeRepo.find(recoveryCode);
        return {
            recoveryCode: recoveryCodeBody.recoveryCode,
            expirationDate: recoveryCodeBody.expirationDate,
            email: recoveryCodeBody.email
        }
    }
}