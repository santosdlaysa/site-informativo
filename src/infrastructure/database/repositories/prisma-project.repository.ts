import {
  GalleryItemInput,
  GalleryItemView,
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

  async deleteGalleryItem(ownerPostId: string, itemId: string): Promise<void> {
    await prisma.projectItem.deleteMany({ where: { id: itemId, ownerPostId } });
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
}
