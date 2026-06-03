import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { container } from "@/infrastructure/container";
import { AdminEventForm } from "@/presentation/components/admin/admin-event-form";
import { updateEventAction } from "@/presentation/actions/event-actions";
import { dateInput, hourMinute } from "@/presentation/lib/datetime";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Editar evento — Admin" };

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [events, categories] = await Promise.all([
    container.listEvents.execute(),
    container.listCategories.execute(),
  ]);

  const event = events.find((e) => e.id === id);
  if (!event) notFound();

  const startsAt = new Date(event.startsAt);
  const action = updateEventAction.bind(null, id);

  return (
    <>
      <div className="page-top">
        <div>
          <h1>Editar evento</h1>
          <div className="sub">Atualize as informações do evento</div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h2>{event.title}</h2>
        </div>
        <div className="panel-pad">
          <AdminEventForm
            action={action}
            categories={categories.map((c) => ({ id: c.id, name: c.name }))}
            isEdit
            initial={{
              title: event.title,
              description: event.description ?? "",
              categoryId: event.categoryId,
              format: event.format,
              location: event.location ?? "",
              coverImage: event.coverImage,
              date: dateInput(startsAt),
              time: hourMinute(startsAt),
              capacity: event.capacity != null ? String(event.capacity) : "",
            }}
          />
        </div>
      </div>
    </>
  );
}
