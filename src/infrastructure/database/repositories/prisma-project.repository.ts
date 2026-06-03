import {
  GalleryItemInput,
  GalleryItemView,
  ProjectOwnerView,
  ProjectRepository,
} from "@/core/domain/project/project.repository";
import { prisma } from "../prisma";

export class PrismaProjectRepository implements ProjectRepository {
  async replaceGallery(ownerPostId: string, items: GalleryItemInput[]): Promise<void> {
    await prisma.$transaction([
      prisma.projectItem.deleteMany({ where: { ownerPostId } }),
      prisma.projectItem.createMany({
        data: items.map((it, i) => ({
          ownerPostId,
          image: it.image,
          caption: it.caption,
          linkedPostId: it.linkedPostId,
          position: it.position ?? i,
        })),
      }),
    ]);
  }

  async getGallery(ownerPostId: string): Promise<GalleryItemView[]> {
    const rows = await prisma.projectItem.findMany({
      where: { ownerPostId },
      orderBy: { position: "asc" },
      include: { linkedPost: { select: { slug: true, title: true } } },
    });
    return rows.map((r) => ({
      id: r.id,
      image: r.image,
      caption: r.caption,
      linkedPostId: r.linkedPostId,
      linkedPostSlug: r.linkedPost?.slug ?? null,
      linkedPostTitle: r.linkedPost?.title ?? null,
    }));
  }

  async listOwners(): Promise<ProjectOwnerView[]> {
    const rows = await prisma.post.findMany({
      where: { galleryItems: { some: {} } },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        coverImage: true,
        updatedAt: true,
        _count: { select: { galleryItems: true } },
      },
    });
    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      slug: r.slug,
      status: r.status,
      coverImage: r.coverImage,
      updatedAt: r.updatedAt,
      itemCount: r._count.galleryItems,
    }));
  }
}
