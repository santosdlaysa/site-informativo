/**
 * Composition root: único lugar que conhece as camadas de aplicação E
 * infraestrutura ao mesmo tempo. Monta os use cases com as implementações
 * concretas (Prisma, bcrypt, crypto) e os expõe já prontos para a apresentação.
 */
import { CreatePostUseCase } from "@/core/application/posts/create-post.usecase";
import { UpdatePostUseCase } from "@/core/application/posts/update-post.usecase";
import { DeletePostUseCase } from "@/core/application/posts/delete-post.usecase";
import { GetPostBySlugUseCase } from "@/core/application/posts/get-post-by-slug.usecase";
import { ListPostsUseCase } from "@/core/application/posts/list-posts.usecase";
import { ListPublishedPostsUseCase } from "@/core/application/posts/list-published-posts.usecase";
import { ListCategoriesUseCase } from "@/core/application/categories/list-categories.usecase";
import { AuthenticateUseCase } from "@/core/application/auth/authenticate.usecase";
import {
  GetProfileUseCase,
  UpdateProfileUseCase,
} from "@/core/application/profile/profile.usecases";
import {
  CreateSessionUseCase,
  DeleteSessionUseCase,
  ListSessionsUseCase,
  UpdateSessionUseCase,
} from "@/core/application/program/program.usecases";
import {
  CreateEventUseCase,
  DeleteEventUseCase,
  ListEventsUseCase,
  UpdateEventUseCase,
} from "@/core/application/events/event.usecases";
import {
  GetSettingsUseCase,
  UpdateSettingsUseCase,
} from "@/core/application/settings/settings.usecases";
import {
  CreateUserUseCase,
  DeleteUserUseCase,
  ListUsersUseCase,
} from "@/core/application/users/user.usecases";

import { PrismaPostRepository } from "./database/repositories/prisma-post.repository";
import { PrismaCategoryRepository } from "./database/repositories/prisma-category.repository";
import { PrismaUserRepository } from "./database/repositories/prisma-user.repository";
import { PrismaProgramSessionRepository } from "./database/repositories/prisma-program-session.repository";
import { PrismaEventRepository } from "./database/repositories/prisma-event.repository";
import { PrismaProjectRepository } from "./database/repositories/prisma-project.repository";
import { PrismaSettingsRepository } from "./database/repositories/prisma-settings.repository";
import { CryptoIdGenerator } from "./ids/crypto-id-generator";
import { BcryptPasswordHasher } from "./auth/bcrypt-password-hasher";

const postRepository = new PrismaPostRepository();
const categoryRepository = new PrismaCategoryRepository();
const userRepository = new PrismaUserRepository();
const sessionRepository = new PrismaProgramSessionRepository();
const eventRepository = new PrismaEventRepository();
const projectRepository = new PrismaProjectRepository();
const settingsRepository = new PrismaSettingsRepository();
const idGenerator = new CryptoIdGenerator();
const passwordHasher = new BcryptPasswordHasher();

const createPost = new CreatePostUseCase(postRepository, idGenerator);
const updatePost = new UpdatePostUseCase(postRepository);

export const container = {
  // posts
  createPost,
  updatePost,
  deletePost: new DeletePostUseCase(postRepository),
  getPostBySlug: new GetPostBySlugUseCase(postRepository),
  listPosts: new ListPostsUseCase(postRepository),
  listPublishedPosts: new ListPublishedPostsUseCase(postRepository),
  // categorias
  listCategories: new ListCategoriesUseCase(categoryRepository),
  // programação
  createSession: new CreateSessionUseCase(sessionRepository, idGenerator),
  updateSession: new UpdateSessionUseCase(sessionRepository),
  deleteSession: new DeleteSessionUseCase(sessionRepository),
  listSessions: new ListSessionsUseCase(sessionRepository),
  // eventos
  createEvent: new CreateEventUseCase(eventRepository, idGenerator),
  updateEvent: new UpdateEventUseCase(eventRepository),
  deleteEvent: new DeleteEventUseCase(eventRepository),
  listEvents: new ListEventsUseCase(eventRepository),
  // auth
  authenticate: new AuthenticateUseCase(userRepository, passwordHasher),
  // perfil do autor
  getProfile: new GetProfileUseCase(userRepository),
  updateProfile: new UpdateProfileUseCase(userRepository),
  // configurações do site
  getSettings: new GetSettingsUseCase(settingsRepository),
  updateSettings: new UpdateSettingsUseCase(settingsRepository),
  // gestão de editores
  listUsers: new ListUsersUseCase(userRepository),
  createUser: new CreateUserUseCase(userRepository, passwordHasher),
  deleteUser: new DeleteUserUseCase(userRepository),
  // acesso direto a read models pontuais
  postRepository,
  eventRepository,
  projectRepository,
} as const;
