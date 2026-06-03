import { PostStatus, PostType } from "@/core/domain/post/post-status";
import {
  GalleryItemInput,
  ProjectRepository,
} from "@/core/domain/project/project.repository";
import { CreatePostUseCase } from "../posts/create-post.usecase";
import { UpdatePostUseCase } from "../posts/update-post.usecase";

export interface ProjectItemDTO {
  image?: string | null;
  caption?: string | null;
  linkedPostId?: string | null;
}

export interface SaveProjectDTO {
  title: string;
  description?: string | null;
  categoryId?: string | null;
  status?: PostStatus;
  items: ProjectItemDTO[];
}

function toGalleryInputs(items: ProjectItemDTO[]): GalleryItemInput[] {
  return items
    .filter((it) => it.image || it.linkedPostId)
    .map((it, i) => ({
      image: it.image ?? null,
      caption: it.caption ?? null,
      linkedPostId: it.linkedPostId ?? null,
      position: i,
    }));
}

/** Usa a primeira imagem da galeria como capa do post na listagem. */
function coverFrom(items: ProjectItemDTO[]): string | null {
  return items.find((it) => it.image)?.image ?? null;
}

export class CreateProjectUseCase {
  constructor(
    private readonly createPost: CreatePostUseCase,
    private readonly projects: ProjectRepository,
  ) {}

  async execute(dto: SaveProjectDTO, authorId: string): Promise<{ id: string; slug: string }> {
    // Post comum (Standard): aparece em /posts na sua categoria; a galeria é
    // exibida como uma seção dentro da própria página do post.
    const created = await this.createPost.execute({
      title: dto.title,
      excerpt: dto.description ?? null,
      content: "",
      coverImage: coverFrom(dto.items),
      categoryId: dto.categoryId ?? null,
      status: dto.status,
      type: PostType.Standard,
      authorId,
    });
    await this.projects.replaceGallery(created.id, toGalleryInputs(dto.items));
    return created;
  }
}

export class UpdateProjectUseCase {
  constructor(
    private readonly updatePost: UpdatePostUseCase,
    private readonly projects: ProjectRepository,
  ) {}

  async execute(id: string, dto: SaveProjectDTO): Promise<void> {
    await this.updatePost.execute({
      id,
      title: dto.title,
      excerpt: dto.description ?? null,
      coverImage: coverFrom(dto.items),
      categoryId: dto.categoryId ?? null,
      status: dto.status,
      type: PostType.Standard,
    });
    await this.projects.replaceGallery(id, toGalleryInputs(dto.items));
  }
}
