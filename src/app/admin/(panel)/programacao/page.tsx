import type { Metadata } from "next";
import { container } from "@/infrastructure/container";
import { SessionStatus, SESSION_STATUS_LABEL } from "@/core/domain/program/session-status";
import {
  AdminProgramManager,
  type SessionRowVM,
} from "@/presentation/components/admin/admin-program-manager";
import { dayMonth, hourMinute } from "@/presentation/lib/datetime";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Programação — Admin" };

const STATUS_CLASS: Record<SessionStatus, string> = {
  [SessionStatus.Live]: "pill-pub",
  [SessionStatus.Scheduled]: "pill-draft",
  [SessionStatus.Finished]: "pill-blue",
};

export default async function AdminProgramacaoPage() {
  const [sessions, categories] = await Promise.all([
    container.listSessions.execute(),
    container.listCategories.execute(),
  ]);

  const rows: SessionRowVM[] = sessions.map((s) => {
    const d = new Date(s.startsAt);
    const speaker = s.speaker ?? "—";
    return {
      id: s.id,
      title: s.title,
      speakerLine: s.speakerRole ? `${speaker} · ${s.speakerRole}` : speaker,
      category: s.category,
      dateTime: `${dayMonth(d)} · ${hourMinute(d)} (${s.durationMin}min)`,
      statusLabel: SESSION_STATUS_LABEL[s.status],
      statusClass: STATUS_CLASS[s.status],
    };
  });

  return <AdminProgramManager sessions={rows} categories={categories.map((c) => c.name)} />;
}
