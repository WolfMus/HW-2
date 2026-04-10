export type TokenDbView = {
  id: string;
  userId: string;
  refreshToken: string;
  createdAt: Date;
  expiresAt: Date;
};
