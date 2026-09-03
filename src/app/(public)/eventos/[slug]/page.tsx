import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { container } from "@/infrastructure/container";
import { EVENT_FORMAT_LABEL } from "@/core/domain/event/event-format";
import { ImageSlot } from "@/presentation/components/image-slot";
import { formatLongDate } from "@/presentation/lib/format";
import { hourMinute } from "@/presentation/lib/datetime";
import { CompanyLink as Link } from "@/presentation/components/public/company-link";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ev = await container.eventRepository.findViewBySlug(slug);
  return ev ? { title: ev.title, description: ev.description ?? undefined } : { title: "Evento" };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ev = await container.eventRepository.findViewBySlug(slug);
  if (!ev) notFound();

  return (
    <article className="article">
      <div className="article-wrap">
        <nav className="crumb">
          <Link href="/">Home</Link>
          <span className="sep">›</span>
          <Link href="/eventos">Eventos</Link>
          <span className="sep">›</span>
          <span className="cur">{ev.title}</span>
        </nav>

        <span className="badge badge--eventos-soft">{EVENT_FORMAT_LABEL[ev.format]}</span>
        <h1>{ev.title}</h1>

        <div className="cover">
          <ImageSlot src={ev.coverImage} placeholder="Imagem do evento" rounded={false} />
        </div>

        <div className="ev-info" style={{ marginBottom: 24 }}>
          <div className="row">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            {formatLongDate(ev.startsAt)} · {hourMinute(new Date(ev.startsAt))}
          </div>
          {ev.location && (
            <div className="row">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {ev.location}
            </div>
          )}
          {ev.capacity != null && (
            <div className="row">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              </svg>
              Capacidade: {ev.capacity} vagas
            </div>
          )}
        </div>

        {ev.description && (
          <div className="body">
            {ev.description.split(/\n{2,}/).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        )}

        <div style={{ marginTop: 30 }}>
          <Link className="btn-outline" href="/eventos">
            ← Voltar aos eventos
          </Link>
        </div>
      </div>
    </article>
  );
}
