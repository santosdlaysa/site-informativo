import {
  CategoryRepository,
  CategoryView,
} from "@/core/domain/category/category.repository";
import { PostStatus } from "@/core/domain/post/post-status";
import { prisma } from "../prisma";

export class PrismaCategoryRepository implements CategoryRepository {
  async list(): Promise<CategoryView[]> {
    const rows = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { posts: { where: { status: PostStatus.Published } } },
        },
      },
    });
    return rows.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      variant: c.variant,
      postCount: c._count.posts,
    }));
  }

  async findById(id: string): Promise<CategoryView | null> {
    const c = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { posts: { where: { status: PostStatus.Published } } },
        },
      },
    });
    return c
      ? { id: c.id, name: c.name, slug: c.slug, variant: c.variant, postCount: c._count.posts }
      : null;
  }

  async findBySlug(slug: string): Promise<CategoryView | null> {
    const c = await prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { posts: { where: { status: PostStatus.Published } } },
        },
      },
    });
    return c
      ? { id: c.id, name: c.name, slug: c.slug, variant: c.variant, postCount: c._count.posts }
      : null;
  }
}
