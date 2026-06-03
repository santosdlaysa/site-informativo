import { Post } from "./post.entity";
import { PostStatus, PostType } from "./post-status";

/**
 * Modelos de leitura (read models) retornados pelas consultas.
 * Já trazem dados de relacionamentos "achatados" para a apresentação,
 * sem expor o ORM nem forçar o consumidor a reidratar entidades.
 */
export interface PostListItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  status: PostStatus;
  readingTime: number;
  publishedAt: Date | null;
  createdAt: Date;
  authorName: string;
  authorBio: string | null;
  category: { name: string; slug: string; variant: string } | null;
}

export interface PostDetail extends PostListItem {
  content: string;
  type: string;
}

export interface ListPostsFilter {
  status?: PostStatus;
  type?: PostType;
  categorySlug?: string;
  search?: string;
  skip?: number;
  take?: number;
}

/**
 * Porta (interface) do repositório de posts. A implementação concreta
 * vive na camada de infraestrutura (Prisma). O domínio só conhece este contrato.
 */
export interface PostRepository {
  // Comandos (operam sobre a entidade de domínio)
  save(post: Post): Promise<void>;
  delete(id: string): Promise<void>;
  findEntityById(id: string): Promise<Post | null>;
  slugExists(slug: string, ignoreId?: string): Promise<boolean>;

  // Consultas (retornam read models)
  findDetailBySlug(slug: string): Promise<PostDetail | null>;
  findDetailById(id: string): Promise<PostDetail | null>;
  list(filter?: ListPostsFilter): Promise<PostListItem[]>;
  count(filter?: ListPostsFilter): Promise<number>;
}
