import { ValidationError } from "../shared/errors";
import { PostStatus, PostType } from "./post-status";
import { Slug } from "./slug";

export interface PostProps {
  id: string;
  title: string;
  slug: Slug;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  status: PostStatus;
  type: PostType;
  readingTime: number;
  publishedAt: Date | null;
  authorId: string;
  categoryId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePostInput {
  id: string;
  title: string;
  excerpt?: string | null;
  content?: string;
  coverImage?: string | null;
  type?: PostType;
  status?: PostStatus;
  authorId: string;
  categoryId?: string | null;
  slug?: string;
  now?: Date;
}

const MIN_TITLE = 3;
const WORDS_PER_MINUTE = 200;

/**
 * Entidade central do domínio. Concentra as regras de um post:
 * geração de slug, cálculo de tempo de leitura e transições de publicação.
 */
export class Post {
  private constructor(private props: PostProps) {}

  // --- Fábricas -----------------------------------------------------------

  /** Cria um post novo, validando as invariantes. */
  static create(input: CreatePostInput): Post {
    const title = input.title?.trim() ?? "";
    if (title.length < MIN_TITLE) {
      throw new ValidationError("O título deve ter ao menos 3 caracteres.");
    }

    const now = input.now ?? new Date();
    const status = input.status ?? PostStatus.Draft;
    const content = input.content ?? "";

    return new Post({
      id: input.id,
      title,
      slug: input.slug ? Slug.restore(input.slug) : Slug.fromText(title),
      excerpt: input.excerpt?.trim() || null,
      content,
      coverImage: input.coverImage ?? null,
      status,
      type: input.type ?? PostType.Standard,
      readingTime: Post.estimateReadingTime(content),
      publishedAt: status === PostStatus.Published ? now : null,
      authorId: input.authorId,
      categoryId: input.categoryId ?? null,
      createdAt: now,
      updatedAt: now,
    });
  }

  /** Reidrata um post a partir da persistência, sem revalidar. */
  static restore(props: PostProps): Post {
    return new Post(props);
  }

  // --- Comportamentos -----------------------------------------------------

  changeTitle(title: string, options?: { regenerateSlug?: boolean }): void {
    const trimmed = title.trim();
    if (trimmed.length < MIN_TITLE) {
      throw new ValidationError("O título deve ter ao menos 3 caracteres.");
    }
    this.props.title = trimmed;
    if (options?.regenerateSlug) {
      this.props.slug = Slug.fromText(trimmed);
    }
    this.touch();
  }

  changeContent(content: string): void {
    this.props.content = content;
    this.props.readingTime = Post.estimateReadingTime(content);
    this.touch();
  }

  changeExcerpt(excerpt: string | null): void {
    this.props.excerpt = excerpt?.trim() || null;
    this.touch();
  }

  changeCover(coverImage: string | null): void {
    this.props.coverImage = coverImage ?? null;
    this.touch();
  }

  changeCategory(categoryId: string | null): void {
    this.props.categoryId = categoryId ?? null;
    this.touch();
  }

  changeType(type: PostType): void {
    this.props.type = type;
    this.touch();
  }

  publish(now: Date = new Date()): void {
    if (this.props.status === PostStatus.Published) return;
    this.props.status = PostStatus.Published;
    this.props.publishedAt = this.props.publishedAt ?? now;
    this.touch();
  }

  unpublish(): void {
    if (this.props.status === PostStatus.Draft) return;
    this.props.status = PostStatus.Draft;
    this.touch();
  }

  setPublishedAt(date: Date | null): void {
    this.props.publishedAt = date;
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  static estimateReadingTime(content: string): number {
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
  }

  // --- Acesso somente leitura --------------------------------------------

  get id(): string {
    return this.props.id;
  }
  get title(): string {
    return this.props.title;
  }
  get slug(): Slug {
    return this.props.slug;
  }
  get excerpt(): string | null {
    return this.props.excerpt;
  }
  get content(): string {
    return this.props.content;
  }
  get coverImage(): string | null {
    return this.props.coverImage;
  }
  get status(): PostStatus {
    return this.props.status;
  }
  get type(): PostType {
    return this.props.type;
  }
  get readingTime(): number {
    return this.props.readingTime;
  }
  get publishedAt(): Date | null {
    return this.props.publishedAt;
  }
  get authorId(): string {
    return this.props.authorId;
  }
  get categoryId(): string | null {
    return this.props.categoryId;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date {
    return this.props.updatedAt;
  }
  get isPublished(): boolean {
    return this.props.status === PostStatus.Published;
  }

  /** Snapshot imutável dos dados — usado pelos mappers de infraestrutura. */
  toSnapshot(): Readonly<PostProps> {
    return { ...this.props };
  }
}
