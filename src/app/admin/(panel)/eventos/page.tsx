import type { Metadata } from "next";
import { container } from "@/infrastructure/container";
import { EventFormat, EVENT_FORMAT_LABEL } from "@/core/domain/event/event-format";
import {
  AdminEventManager,
  type EventRowVM,
} from "@/presentation/components/admin/admin-event-manager";
import { formatShortDate } from "@/presentation/lib/format";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Eventos — Admin" };

export default async function AdminEventosPage() {
  const [events, categories] = await Promise.all([
    container.listEvents.execute(),
    container.listCategories.execute(),
  ]);

  const rows: EventRowVM[] = events.map((ev) => ({
    id: ev.id,
    title: ev.title,
    location: ev.location,
    formatLabel: EVENT_FORMAT_LABEL[ev.format],
    online: ev.format === EventFormat.Online,
    date: formatShortDate(ev.startsAt),
  }));

  return <AdminEventManager events={rows} categories={categories.map((c) => c.name)} />;
}
