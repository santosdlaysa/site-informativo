import { Event } from "./event.entity";
import { EventFormat } from "./event-format";

export interface EventView {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  category: string | null;
  format: EventFormat;
  location: string | null;
  startsAt: Date;
  capacity: number | null;
}

export interface EventRepository {
  save(event: Event): Promise<void>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Event | null>;
  slugExists(slug: string, ignoreId?: string): Promise<boolean>;
  list(filter?: { format?: EventFormat }): Promise<EventView[]>;
  findViewBySlug(slug: string): Promise<EventView | null>;
}
