import type { Event as PrismaEvent } from "@prisma/client";
import { Event } from "@/core/domain/event/event.entity";
import { EventFormat } from "@/core/domain/event/event-format";
import { EventRepository, EventView } from "@/core/domain/event/event.repository";
import { Slug } from "@/core/domain/post/slug";
import { prisma } from "../prisma";

function toDomain(row: PrismaEvent): Event {
  return Event.restore({
    id: row.id,
    title: row.title,
    slug: Slug.restore(row.slug),
    description: row.description,
    coverImage: row.coverImage,
    category: row.category,
    format: row.format as EventFormat,
    location: row.location,
    startsAt: row.startsAt,
    capacity: row.capacity,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  });
}

function toView(row: PrismaEvent): EventView {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    coverImage: row.coverImage,
    category: row.category,
    format: row.format as EventFormat,
    location: row.location,
    startsAt: row.startsAt,
    capacity: row.capacity,
  };
}

export class PrismaEventRepository implements EventRepository {
  async save(event: Event): Promise<void> {
    const s = event.toSnapshot();
    const data = {
      id: s.id,
      title: s.title,
      slug: s.slug.value,
      description: s.description,
      coverImage: s.coverImage,
      category: s.category,
      format: s.format,
      location: s.location,
      startsAt: s.startsAt,
      capacity: s.capacity,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    };
    await prisma.event.upsert({ where: { id: s.id }, create: data, update: data });
  }

  async delete(id: string): Promise<void> {
    await prisma.event.delete({ where: { id } });
  }

  async findById(id: string): Promise<Event | null> {
    const row = await prisma.event.findUnique({ where: { id } });
    return row ? toDomain(row) : null;
  }

  async slugExists(slug: string, ignoreId?: string): Promise<boolean> {
    const found = await prisma.event.findFirst({
      where: { slug, ...(ignoreId ? { NOT: { id: ignoreId } } : {}) },
      select: { id: true },
    });
    return found !== null;
  }

  async list(filter: { format?: EventFormat } = {}): Promise<EventView[]> {
    const rows = await prisma.event.findMany({
      where: filter.format ? { format: filter.format } : {},
      orderBy: { startsAt: "asc" },
    });
    return rows.map(toView);
  }

  async findViewBySlug(slug: string): Promise<EventView | null> {
    const row = await prisma.event.findUnique({ where: { slug } });
    return row ? toView(row) : null;
  }
}
