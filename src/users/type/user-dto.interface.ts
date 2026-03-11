export interface UserDto {
  login: string;
  email: string;
  hash: string;
  salt: string;
  createdAt: Date;
}
