import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { container } from "@/infrastructure/container";
import { AdminSessionForm } from "@/presentation/components/admin/admin-session-form";
import { updateSessionAction } from "@/presentation/actions/program-actions";
import { dateInput, hourMinute } from "@/presentation/lib/datetime";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Editar sessão — Admin" };

export default async function EditSessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [sessions, categories] = await Promise.all([
    container.listSessions.execute(),
    container.listCategories.execute(),
  ]);

  const session = sessions.find((s) => s.id === id);
  if (!session) notFound();

  const startsAt = new Date(session.startsAt);
  const action = updateSessionAction.bind(null, id);

  return (
    <>
      <div className="page-top">
        <div>
          <h1>Editar sessão</h1>
          <div className="sub">Atualize os dados da sessão da agenda</div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h2>{session.title}</h2>
        </div>
        <div className="panel-pad">
          <AdminSessionForm
            action={action}
            categories={categories.map((c) => ({ id: c.id, name: c.name }))}
            isEdit
            initial={{
              title: session.title,
              description: session.description ?? "",
              speaker: session.speaker ?? "",
              speakerRole: session.speakerRole ?? "",
              categoryId: session.categoryId,
              date: dateInput(startsAt),
              time: hourMinute(startsAt),
              durationMin: String(session.durationMin),
              status: session.status,
            }}
          />
        </div>
      </div>
    </>
  );
}
