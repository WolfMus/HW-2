export type User = {
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
  recovery: {
    recoveryCode: string | null;
    recoveryCodeExpiration: string | null;
  }
};
