import { ValidationError } from "../shared/errors";
import { Slug } from "../post/slug";
import { EventFormat } from "./event-format";

export interface EventProps {
  id: string;
  title: string;
  slug: Slug;
  description: string | null;
  coverImage: string | null;
  categoryId: string | null;
  format: EventFormat;
  location: string | null;
  startsAt: Date;
  capacity: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEventInput {
  id: string;
  title: string;
  description?: string | null;
  coverImage?: string | null;
  categoryId?: string | null;
  format?: EventFormat;
  location?: string | null;
  startsAt: Date;
  capacity?: number | null;
  slug?: string;
  now?: Date;
}

export type UpdateEventPatch = Partial<Omit<CreateEventInput, "id" | "now" | "slug">>;

/** Entidade de evento da comunidade — apenas informativo (sem inscrição/checkout). */
export class Event {
  private constructor(private props: EventProps) {}

  static create(input: CreateEventInput): Event {
    const title = input.title?.trim() ?? "";
    if (title.length < 3) throw new ValidationError("O nome do evento deve ter ao menos 3 caracteres.");
    if (Number.isNaN(input.startsAt?.getTime?.())) throw new ValidationError("Data do evento inválida.");
    const now = input.now ?? new Date();
    return new Event({
      id: input.id,
      title,
      slug: input.slug ? Slug.restore(input.slug) : Slug.fromText(title),
      description: input.description?.trim() || null,
      coverImage: input.coverImage ?? null,
      categoryId: input.categoryId?.trim() || null,
      format: input.format ?? EventFormat.Presential,
      location: input.location?.trim() || null,
      startsAt: input.startsAt,
      capacity: input.capacity ?? null,
      createdAt: now,
      updatedAt: now,
    });
  }

  static restore(props: EventProps): Event {
    return new Event(props);
  }

  update(patch: UpdateEventPatch & { regenerateSlug?: boolean }): void {
    if (patch.title !== undefined) {
      const t = patch.title.trim();
      if (t.length < 3) throw new ValidationError("O nome do evento deve ter ao menos 3 caracteres.");
      this.props.title = t;
      if (patch.regenerateSlug) this.props.slug = Slug.fromText(t);
    }
    if (patch.description !== undefined) this.props.description = patch.description?.trim() || null;
    if (patch.coverImage !== undefined) this.props.coverImage = patch.coverImage ?? null;
    if (patch.categoryId !== undefined) this.props.categoryId = patch.categoryId?.trim() || null;
    if (patch.format !== undefined) this.props.format = patch.format;
    if (patch.location !== undefined) this.props.location = patch.location?.trim() || null;
    if (patch.startsAt !== undefined) {
      if (Number.isNaN(patch.startsAt.getTime())) throw new ValidationError("Data inválida.");
      this.props.startsAt = patch.startsAt;
    }
    if (patch.capacity !== undefined) this.props.capacity = patch.capacity ?? null;
    this.props.updatedAt = new Date();
  }

  get id(): string {
    return this.props.id;
  }
  get slug(): Slug {
    return this.props.slug;
  }
  withSlug(slug: Slug): Event {
    return new Event({ ...this.props, slug });
  }

  toSnapshot(): Readonly<EventProps> {
    return { ...this.props };
  }
}
