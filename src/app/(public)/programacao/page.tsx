import type { Metadata } from "next";
import { container } from "@/infrastructure/container";
import { SessionStatus } from "@/core/domain/program/session-status";
import {
  ProgramTimeline,
  type DayVM,
  type SlotVM,
} from "@/presentation/components/public/program-timeline";
import { hourMinute, dayAndMonthAbbr } from "@/presentation/lib/datetime";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Programação" };

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default async function ProgramacaoPage() {
  const [sessions, categories] = await Promise.all([
    container.listSessions.execute(),
    container.listCategories.execute(),
  ]);

  const variantByName = new Map(categories.map((c) => [c.name.toLowerCase(), c.variant]));

  // Sessões encerradas não aparecem no site (continuam visíveis no admin).
  const visibleSessions = sessions.filter((s) => s.status !== SessionStatus.Finished);

  // Agrupa por dia do calendário, preservando a ordem cronológica.
  const dayMap = new Map<string, DayVM>();
  for (const s of visibleSessions) {
    const d = new Date(s.startsAt);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (!dayMap.has(key)) {
      const { day, month } = dayAndMonthAbbr(d);
      dayMap.set(key, {
        key,
        dow: WEEKDAYS[d.getDay()] ?? "",
        dnum: day,
        month,
        year: String(d.getFullYear()),
        sessions: [],
      });
    }
    const slot: SlotVM = {
      id: s.id,
      hr: hourMinute(d),
      dur: `${s.durationMin} min`,
      live: s.status === SessionStatus.Live,
      categoryName: s.categoryName,
      categoryVariant: s.categoryName ? variantByName.get(s.categoryName.toLowerCase()) ?? "tec" : null,
      title: s.title,
      description: s.description,
      speaker: s.speaker,
      speakerRole: s.speakerRole,
      joinLink: s.link,
    };
    dayMap.get(key)!.sessions.push(slot);
  }

  const days = Array.from(dayMap.values());

  return (
    <>
      <section className="page-hero page-hero--brand">
        <div className="wrap">
          <h1>Programação</h1>
          <p>
            Acompanhe nossas lives, workshops e bate-papos. Escolha um dia para ver a agenda
            completa.
          </p>
        </div>
      </section>

      <div className="wrap">
        <ProgramTimeline days={days} />
      </div>
    </>
  );
}
