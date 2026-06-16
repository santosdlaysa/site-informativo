export interface CalendarDateView {
  id: string;
  title: string;
  date: Date;
  color: string;
  description: string | null;
}

export interface CalendarDateRepository {
  save(item: {
    id: string;
    title: string;
    date: Date;
    color: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Promise<void>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<CalendarDateView | null>;
  list(): Promise<CalendarDateView[]>;
  listByMonth(year: number, month: number): Promise<CalendarDateView[]>;
}
