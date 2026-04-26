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

// // CORE
// export const cryptoService = new BcryptService();
// export const emailService = new NodeMailerService();

// // BLOGS
// const blogsRepo = new BlogsRepository();
// const blogsQueryRepo = new BlogsQwRepository();
// export const blogsService = new BlogsService(blogsRepo, blogsQueryRepo);

// // POSTS
// export const postsRepo = new PostsRepository();
// export const postsQueryRepo = new PostsQwRepository();
// export const postsService = new PostsService(postsRepo, postsQueryRepo);

// // USERS
// export const usersRepo = new UsersRepository();
// export const usersQueryRepo = new UsersQwRepository();
// export const usersService = new UsersService(
//   usersRepo,
//   usersQueryRepo,
//   cryptoService,
//   emailService,
// );

// // SECURITY
// export const securityRepo = new SecurityDeviceRepository();
// export const securityService = new SecurityDeviceService(securityRepo);

// // AUTH
// export const recoveryCodeRepo = new RecoveryCodeRepository();
// export const rateLimitRepo = new RateLimitRepository();
// export const tokenRepo = new TokenRepository();
// export const tokenQueryRepo = new TokenQwRepository();
// export const jwtService = new JwtService(tokenRepo, tokenQueryRepo);
// export const authService = new AuthService(
//   usersRepo,
//   usersQueryRepo,
//   cryptoService,
//   jwtService,
//   securityService,
//   emailService,
//   recoveryCodeRepo,
// );

// // COMMENTS
// export const commentsRepo = new CommentsRepository();
// export const commentsQueryRepo = new CommentsQwRepository();
// export const commentsService = new CommentsService(
//   commentsRepo,
//   commentsQueryRepo,
//   usersQueryRepo,
// );

// // CONTROLLERS
// export const blogsController = new BlogsController(blogsService, postsService);
// export const commentsController = new CommentsController(commentsService);
// export const postsController = new PostsController(
//   postsService,
//   blogsService,
//   commentsService,
// );
// export const usersController = new UsersController(
//   usersQueryRepo,
//   usersService,
// );
// export const securityController = new SecurityController(
//   securityService,
//   jwtService,
// );
// export const authController = new AuthController(
//   authService,
//   jwtService,
//   emailService,
//   securityService,
//   usersService,
//   usersQueryRepo,
// );

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