export type User = {
  login: string;
  email: string;
  hash: string;
  salt: string;
  createdAt: Date;
  emailConfirmation: {
    confirmationCode: string;
    expirationCode: Date;
    isConfirmed: boolean;
  };
};
