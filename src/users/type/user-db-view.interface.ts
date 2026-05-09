export interface UserDb {
  id: string;
  login: string;
  email: string;
  hash: string;
  salt: string;
  createdAt: Date;
  emailConfirmation: {
    confirmationCode: string | null;
    expirationCode: Date | null;
    isConfirmed: boolean;
  };
}
