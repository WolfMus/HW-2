import "reflect-metadata";
import { Container } from "inversify";
import { BlogsService } from "./blogs/application/blogs.service";
import { BlogsQwRepository } from "./blogs/repositories/blogs-query.repository";
import { BlogsRepository } from "./blogs/repositories/blogs.repository";
import { BlogsController } from "./blogs/routers/blogs-controller";
import { CommentsService } from "./comments/application/comments.service";
import { CommentsQwRepository } from "./comments/repositories/comments-query.repository";
import { CommentsRepository } from "./comments/repositories/comments.repository";
import { CommentsController } from "./comments/routers/comments-controller";
import { PostsService } from "./posts/application/posts-service";
import { PostsQwRepository } from "./posts/repository/posts-query.repository";
import { PostsRepository } from "./posts/repository/posts.repository";
import { PostsController } from "./posts/routers/posts-controller";
import { SecurityDeviceService } from "./security/application/securityDevice.service";
import { SecurityDeviceRepository } from "./security/repository/security-device.repository";
import { SecurityController } from "./security/routers/security-controller";
import { UsersService } from "./users/application/users.service";
import { UsersRepository } from "./users/repository/users.repository";
import { UsersQwRepository } from "./users/repository/usersQw.repository";
import { UsersController } from "./users/routers/users-controller";
import { AuthService } from "./auth/application/authService";
import { JwtService } from "./auth/application/jwtService";
import { NodeMailerService } from "./auth/application/nodeMailerService";
import { RateLimitRepository } from "./auth/repositories/rate-limit.repository";
import { RecoveryCodeRepository } from "./auth/repositories/recovery-code.repository";
import { TokenQwRepository } from "./auth/repositories/token-query.repository";
import { TokenRepository } from "./auth/repositories/token.repository";
import { AuthController } from "./auth/routers/auth-controller";
import { BcryptService } from "./core/heplers/bcrypt-service";

export const container = new Container();

// BLOGS
container.bind(BlogsRepository).toSelf();
container.bind(BlogsQwRepository).toSelf();
container.bind(BlogsService).toSelf();
container.bind(BlogsController).toSelf();

// POSTS
container.bind(PostsRepository).toSelf();
container.bind(PostsQwRepository).toSelf();
container.bind(PostsService).toSelf();
container.bind(PostsController).toSelf();

// SECURITY
container.bind(SecurityDeviceRepository).toSelf();
container.bind(SecurityDeviceService).toSelf();
container.bind(SecurityController).toSelf();

// COMMENTS
container.bind(CommentsRepository).toSelf();
container.bind(CommentsQwRepository).toSelf();
container.bind(CommentsService).toSelf();
container.bind(CommentsController).toSelf();

// USERS
container.bind(UsersRepository).toSelf();
container.bind(UsersQwRepository).toSelf();
container.bind(UsersService).toSelf();
container.bind(UsersController).toSelf();

// AUTH
container.bind(AuthService).toSelf();
container.bind(JwtService).toSelf();
container.bind(NodeMailerService).toSelf();
container.bind(BcryptService).toSelf();
container.bind(RateLimitRepository).toSelf();
container.bind(RecoveryCodeRepository).toSelf();
container.bind(TokenRepository).toSelf();
container.bind(TokenQwRepository).toSelf();
container.bind(AuthController).toSelf();