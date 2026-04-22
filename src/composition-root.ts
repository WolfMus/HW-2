import { AuthService } from "./auth/application/authService";
import { JwtService } from "./auth/application/jwtService";
import { NodeMailerService } from "./auth/application/nodeMailerService";
import { RateLimitRepository } from "./auth/repositories/rate-limit.repository";
import { TokenQwRepository } from "./auth/repositories/token-query.repository";
import { TokenRepository } from "./auth/repositories/token.repository";
import { BlogsService } from "./blogs/application/blogs.service";
import { BlogsQwRepository } from "./blogs/repositories/blogs-query.repository";
import { BlogsRepository } from "./blogs/repositories/blogs.repository";
import { CommentsService } from "./comments/application/comments.service";
import { CommentsQwRepository } from "./comments/repositories/comments-query.repository";
import { CommentsRepository } from "./comments/repositories/comments.repository";
import { BcryptService } from "./core/heplers/bcrypt-service";
import { PostsService } from "./posts/application/posts-service";
import { PostsQwRepository } from "./posts/repository/posts-query.repository";
import { PostsRepository } from "./posts/repository/posts.repository";
import { SecurityDeviceService } from "./security/application/securityDevice.service";
import { SecurityDeviceRepository } from "./security/repository/security-device.repository";
import { UsersService } from "./users/application/users.service";
import { UsersRepository } from "./users/repository/users.repository";
import { UsersQwRepository } from "./users/repository/usersQw.repository";

// CORE
export const cryptoService = new BcryptService();
export const emailService = new NodeMailerService();

// BLOGS
export const blogsRepo = new BlogsRepository();
export const blogsQueryRepo = new BlogsQwRepository();
export const blogsService = new BlogsService(blogsRepo, blogsQueryRepo);

// POSTS
export const postsRepo = new PostsRepository();
export const postsQueryRepo = new PostsQwRepository();
export const postsService = new PostsService(postsRepo, postsQueryRepo);


// USERS
export const usersRepo = new UsersRepository();
export const usersQueryRepo = new UsersQwRepository();
export const usersService = new UsersService(usersRepo, usersQueryRepo, cryptoService, emailService);

// AUTH
export const rateLimitRepo = new RateLimitRepository();
export const tokenRepo = new TokenRepository();
export const tokenQueryRepo = new TokenQwRepository();
export const authService = new AuthService(usersRepo, usersQueryRepo, emailService);
export const jwtService = new JwtService(tokenRepo, tokenQueryRepo);

// COMMENTS
export const commentsRepo = new CommentsRepository();
export const commentsQueryRepo = new CommentsQwRepository();
export const commentsService = new CommentsService(commentsRepo);


// SECURITY
export const securityRepo = new SecurityDeviceRepository();
export const securityService = new SecurityDeviceService(securityRepo);