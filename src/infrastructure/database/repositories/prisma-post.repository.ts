import type { Prisma } from "@prisma/client";
import { Post } from "@/core/domain/post/post.entity";
import {
  ListPostsFilter,
  PostDetail,
  PostListItem,
  PostRepository,
} from "@/core/domain/post/post.repository";
import { prisma } from "../prisma";
import { PostMapper } from "../mappers/post.mapper";

const relationsInclude = {
  author: { select: { name: true, bio: true } },
  category: { select: { name: true, slug: true, variant: true } },
} satisfies Prisma.PostInclude;

export class PrismaPostRepository implements PostRepository {
  async save(post: Post): Promise<void> {
    const data = PostMapper.toPersistence(post);
    await prisma.post.upsert({
      where: { id: post.id },
      create: data,
      update: data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.post.delete({ where: { id } });
  }

  async findEntityById(id: string): Promise<Post | null> {
    const row = await prisma.post.findUnique({ where: { id } });
    return row ? PostMapper.toDomain(row) : null;
  }

  async slugExists(slug: string, ignoreId?: string): Promise<boolean> {
    const found = await prisma.post.findFirst({
      where: { slug, ...(ignoreId ? { NOT: { id: ignoreId } } : {}) },
      select: { id: true },
    });
    return found !== null;
  }

  async findDetailBySlug(slug: string): Promise<PostDetail | null> {
    const row = await prisma.post.findUnique({
      where: { slug },
      include: relationsInclude,
    });
    return row ? PostMapper.toDetail(row) : null;
  }

  async findDetailById(id: string): Promise<PostDetail | null> {
    const row = await prisma.post.findUnique({
      where: { id },
      include: relationsInclude,
    });
    return row ? PostMapper.toDetail(row) : null;
  }

  async list(filter: ListPostsFilter = {}): Promise<PostListItem[]> {
    const rows = await prisma.post.findMany({
      where: this.buildWhere(filter),
      include: relationsInclude,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      skip: filter.skip,
      take: filter.take,
    });
    return rows.map(PostMapper.toListItem);
  }

  async count(filter: ListPostsFilter = {}): Promise<number> {
    return prisma.post.count({ where: this.buildWhere(filter) });
  }

  private buildWhere(filter: ListPostsFilter): Prisma.PostWhereInput {
    return {
      ...(filter.status ? { status: filter.status } : {}),
      ...(filter.type ? { type: filter.type } : {}),
      ...(filter.categorySlug ? { category: { slug: filter.categorySlug } } : {}),
      ...(filter.search
        ? {
            OR: [
              { title: { contains: filter.search, mode: "insensitive" } },
              { excerpt: { contains: filter.search, mode: "insensitive" } },
              { content: { contains: filter.search, mode: "insensitive" } },
            ],
          }
        : {}),
    };
  }
}
