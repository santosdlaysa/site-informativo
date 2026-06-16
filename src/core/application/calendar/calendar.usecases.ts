import { CalendarDateRepository, CalendarDateView } from "@/core/domain/calendar/calendar-date.repository";
import { IdGenerator } from "../ports/id-generator";

export interface CalendarDateDTO {
  title: string;
  date: Date;
  color: string;
  description?: string | null;
}

export class CreateCalendarDateUseCase {
  constructor(
    private readonly repo: CalendarDateRepository,
    private readonly ids: IdGenerator,
  ) {}

  async execute(dto: CalendarDateDTO): Promise<string> {
    const now = new Date();
    const id = this.ids.generate();
    await this.repo.save({
      id,
      title: dto.title,
      date: dto.date,
      color: dto.color,
      description: dto.description ?? null,
      createdAt: now,
      updatedAt: now,
    });
    return id;
  }
}

export class UpdateCalendarDateUseCase {
  constructor(private readonly repo: CalendarDateRepository) {}

  async execute(id: string, dto: CalendarDateDTO): Promise<void> {
    const existing = await this.repo.findById(id);
    if (!existing) throw new Error(`CalendarDate ${id} not found`);
    await this.repo.save({
      id,
      title: dto.title,
      date: dto.date,
      color: dto.color,
      description: dto.description ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}

export class DeleteCalendarDateUseCase {
  constructor(private readonly repo: CalendarDateRepository) {}

  async execute(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}

export class ListCalendarDatesUseCase {
  constructor(private readonly repo: CalendarDateRepository) {}

  execute(): Promise<CalendarDateView[]> {
    return this.repo.list();
  }
}

export class ListCalendarDatesByMonthUseCase {
  constructor(private readonly repo: CalendarDateRepository) {}

  execute(year: number, month: number): Promise<CalendarDateView[]> {
    return this.repo.listByMonth(year, month);
  }
}
