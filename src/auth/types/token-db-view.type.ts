export type TokenDbView = {
    id: string;
    refreshToken: string;
    userId: string;
    createdAt: Date;
    expiredAt: Date;
}