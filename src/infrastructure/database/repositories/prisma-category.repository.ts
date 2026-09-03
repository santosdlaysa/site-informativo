import {
  CategoryRepository,
  CategoryView,
} from "@/core/domain/category/category.repository";
import { PostStatus } from "@/core/domain/post/post-status";
import { Slug } from "@/core/domain/post/slug";
import { prisma } from "../prisma";
import { getActiveCompanyId } from "@/infrastructure/tenant";

export class PrismaCategoryRepository implements CategoryRepository {
  async list(): Promise<CategoryView[]> {
    const companyId = await getActiveCompanyId();
    const rows = await prisma.category.findMany({
      where: { companyId },
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
    const companyId = await getActiveCompanyId();
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
    const companyId = await getActiveCompanyId();
    const c = await prisma.category.findFirst({
      where: { slug, companyId },
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

  async create(name: string): Promise<CategoryView> {
    const companyId = await getActiveCompanyId();
    const trimmed = name.trim();
    const slug = Slug.fromText(trimmed).value;
    // Idempotente: reaproveita uma categoria já existente com mesmo nome ou slug.
    const existing = await prisma.category.findFirst({
      where: { companyId, OR: [{ name: trimmed }, { slug }] },
    });
    const c =
      existing ??
      (await prisma.category.create({ data: { name: trimmed, slug, companyId } }));
    return { id: c.id, name: c.name, slug: c.slug, variant: c.variant, postCount: 0 };
  }
}
