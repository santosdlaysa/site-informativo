import { PostStatus, PostType } from "@/core/domain/post/post-status";
import {
  PostDetail,
  PostListItem,
  PostRepository,
} from "@/core/domain/post/post.repository";
import {
  GalleryItemInput,
  GalleryItemView,
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

export interface ProjectGallery {
  post: PostDetail;
  items: GalleryItemView[];
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

export class CreateProjectUseCase {
  constructor(
    private readonly createPost: CreatePostUseCase,
    private readonly projects: ProjectRepository,
  ) {}

  async execute(dto: SaveProjectDTO, authorId: string): Promise<{ id: string; slug: string }> {
    const created = await this.createPost.execute({
      title: dto.title,
      excerpt: dto.description ?? null,
      content: "",
      categoryId: dto.categoryId ?? null,
      status: dto.status,
      type: PostType.Projects,
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
      categoryId: dto.categoryId ?? null,
      status: dto.status,
      type: PostType.Projects,
    });
    await this.projects.replaceGallery(id, toGalleryInputs(dto.items));
  }
}

export class ListProjectsUseCase {
  constructor(private readonly posts: PostRepository) {}

  execute(): Promise<PostListItem[]> {
    return this.posts.list({ type: PostType.Projects });
  }
}

export class GetProjectBySlugUseCase {
  constructor(
    private readonly posts: PostRepository,
    private readonly projects: ProjectRepository,
  ) {}

  async execute(slug: string): Promise<ProjectGallery | null> {
    const post = await this.posts.findDetailBySlug(slug);
    if (!post || post.type !== PostType.Projects) return null;
    const items = await this.projects.getGallery(post.id);
    return { post, items };
  }
}

export class GetProjectForEditUseCase {
  constructor(
    private readonly posts: PostRepository,
    private readonly projects: ProjectRepository,
  ) {}

  async execute(id: string): Promise<ProjectGallery | null> {
    const post = await this.posts.findDetailById(id);
    if (!post) return null;
    const items = await this.projects.getGallery(id);
    return { post, items };
  }
}
