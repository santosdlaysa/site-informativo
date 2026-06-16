import { CalendarDateRepository, CalendarDateView } from "@/core/domain/calendar/calendar-date.repository";
import { prisma } from "../prisma";

export class PrismaCalendarDateRepository implements CalendarDateRepository {
  async save(item: {
    id: string;
    title: string;
    date: Date;
    color: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Promise<void> {
    await prisma.calendarDate.upsert({
      where: { id: item.id },
      create: item,
      update: {
        title: item.title,
        date: item.date,
        color: item.color,
        description: item.description,
        updatedAt: item.updatedAt,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.calendarDate.delete({ where: { id } });
  }

  async findById(id: string): Promise<CalendarDateView | null> {
    const row = await prisma.calendarDate.findUnique({ where: { id } });
    if (!row) return null;
    return { id: row.id, title: row.title, date: row.date, color: row.color, description: row.description };
  }

  async list(): Promise<CalendarDateView[]> {
    const rows = await prisma.calendarDate.findMany({ orderBy: { date: "asc" } });
    return rows.map((r) => ({ id: r.id, title: r.title, date: r.date, color: r.color, description: r.description }));
  }

  async listByMonth(year: number, month: number): Promise<CalendarDateView[]> {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);
    const rows = await prisma.calendarDate.findMany({
      where: { date: { gte: start, lt: end } },
      orderBy: { date: "asc" },
    });
    return rows.map((r) => ({ id: r.id, title: r.title, date: r.date, color: r.color, description: r.description }));
  }
}
