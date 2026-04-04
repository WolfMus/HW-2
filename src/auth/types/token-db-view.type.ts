export type TokenDbView = {
  id: string;
  tokenId: string;
  userId: string;
  refreshToken: string;
  createdAt: Date;
  expiresAt: Date;
};
