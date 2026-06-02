import type {
  Post as PrismaPost,
  Category as PrismaCategory,
  User as PrismaUser,
  Prisma,
} from "@prisma/client";
import { Post } from "@/core/domain/post/post.entity";
import { Slug } from "@/core/domain/post/slug";
import { PostStatus, PostType } from "@/core/domain/post/post-status";
import {
  PostDetail,
  PostListItem,
} from "@/core/domain/post/post.repository";

type PostWithRelations = PrismaPost & {
  author: Pick<PrismaUser, "name">;
  category: Pick<PrismaCategory, "name" | "slug" | "variant"> | null;
};

export const PostMapper = {
  /** Linha do Prisma -> entidade de domínio (para comandos). */
  toDomain(row: PrismaPost): Post {
    return Post.restore({
      id: row.id,
      title: row.title,
      slug: Slug.restore(row.slug),
      excerpt: row.excerpt,
      content: row.content,
      coverImage: row.coverImage,
      status: row.status as PostStatus,
      type: row.type as PostType,
      readingTime: row.readingTime,
      publishedAt: row.publishedAt,
      authorId: row.authorId,
      categoryId: row.categoryId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  },

  /** Entidade de domínio -> dados de persistência. */
  toPersistence(post: Post): Prisma.PostUncheckedCreateInput {
    const s = post.toSnapshot();
    return {
      id: s.id,
      title: s.title,
      slug: s.slug.value,
      excerpt: s.excerpt,
      content: s.content,
      coverImage: s.coverImage,
      status: s.status,
      type: s.type,
      readingTime: s.readingTime,
      publishedAt: s.publishedAt,
      authorId: s.authorId,
      categoryId: s.categoryId,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    };
  },

  toListItem(row: PostWithRelations): PostListItem {
    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt,
      coverImage: row.coverImage,
      status: row.status as PostStatus,
      readingTime: row.readingTime,
      publishedAt: row.publishedAt,
      createdAt: row.createdAt,
      authorName: row.author.name,
      category: row.category
        ? { name: row.category.name, slug: row.category.slug, variant: row.category.variant }
        : null,
    };
  },

  toDetail(row: PostWithRelations): PostDetail {
    return {
      ...PostMapper.toListItem(row),
      content: row.content,
      type: row.type,
    };
  },
};
