export type TokenDbView = {
    id: string;
    tokenId: string,
    userId: string,
    refreshToken: string,
    expiresAt: Date,
    createdAt: Date,
}