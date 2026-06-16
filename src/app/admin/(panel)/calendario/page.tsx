import type { Metadata } from "next";
import { container } from "@/infrastructure/container";
import { AdminCalendarManager, type CalendarDateRowVM } from "@/presentation/components/admin/admin-calendar-manager";
import { formatShortDate } from "@/presentation/lib/format";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Calendário Comemorativo — Admin" };

export default async function AdminCalendarioPage() {
  const dates = await container.listCalendarDates.execute();

  const rows: CalendarDateRowVM[] = dates.map((d) => ({
    id: d.id,
    title: d.title,
    date: formatShortDate(d.date),
    color: d.color,
    description: d.description,
  }));

  return <AdminCalendarManager dates={rows} />;
}
