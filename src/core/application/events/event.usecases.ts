import { NotFoundError } from "@/core/domain/shared/errors";
import { Event } from "@/core/domain/event/event.entity";
import { EventFormat } from "@/core/domain/event/event-format";
import { EventRepository, EventView } from "@/core/domain/event/event.repository";
import { Slug } from "@/core/domain/post/slug";
import { IdGenerator } from "../ports/id-generator";

export interface CreateEventDTO {
  title: string;
  description?: string | null;
  coverImage?: string | null;
  categoryId?: string | null;
  format?: EventFormat;
  location?: string | null;
  startsAt: Date;
  capacity?: number | null;
}

export type UpdateEventDTO = CreateEventDTO & { id: string };

async function uniqueSlug(repo: EventRepository, base: Slug, ignoreId?: string): Promise<Slug> {
  let candidate = base.value;
  let n = 2;
  while (await repo.slugExists(candidate, ignoreId)) {
    candidate = `${base.value}-${n++}`;
  }
  return Slug.restore(candidate);
}

export class CreateEventUseCase {
  constructor(
    private readonly repo: EventRepository,
    private readonly ids: IdGenerator,
  ) {}

  async execute(dto: CreateEventDTO): Promise<{ id: string; slug: string }> {
    const event = Event.create({ id: this.ids.generate(), ...dto });
    const slug = await uniqueSlug(this.repo, event.slug);
    const finalEvent = event.withSlug(slug);
    await this.repo.save(finalEvent);
    return { id: finalEvent.id, slug: slug.value };
  }
}

export class UpdateEventUseCase {
  constructor(private readonly repo: EventRepository) {}

  async execute({ id, ...patch }: UpdateEventDTO): Promise<void> {
    const event = await this.repo.findById(id);
    if (!event) throw new NotFoundError("Evento", id);

    const titleChanged = patch.title !== undefined && patch.title.trim() !== event.toSnapshot().title;
    event.update({ ...patch, regenerateSlug: titleChanged });

    let finalEvent = event;
    if (titleChanged) {
      const slug = await uniqueSlug(this.repo, event.slug, event.id);
      finalEvent = event.withSlug(slug);
    }
    await this.repo.save(finalEvent);
  }
}

export class DeleteEventUseCase {
  constructor(private readonly repo: EventRepository) {}

  async execute(id: string): Promise<void> {
    const event = await this.repo.findById(id);
    if (!event) throw new NotFoundError("Evento", id);
    await this.repo.delete(id);
  }
}

export class ListEventsUseCase {
  constructor(private readonly repo: EventRepository) {}

  execute(filter?: { format?: EventFormat }): Promise<EventView[]> {
    return this.repo.list(filter);
  }
}
