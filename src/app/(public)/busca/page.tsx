import Link from "next/link";
import type { Metadata } from "next";
import { container } from "@/infrastructure/container";
import { PostType } from "@/core/domain/post/post-status";
import { EventFormat } from "@/core/domain/event/event-format";
import { PostCard } from "@/presentation/components/public/post-card";
import { ImageSlot } from "@/presentation/components/image-slot";
import { formatLongDate } from "@/presentation/lib/format";
import { dayAndMonthAbbr, hourMinute } from "@/presentation/lib/datetime";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Busca",
  description: "Encontre posts, ações e eventos do Raros Boa Vista.",
};

export default async function BuscaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const search = q?.trim() || undefined;

  const [posts, events] = search
    ? await Promise.all([
        container.listPublishedPosts.execute({ search, take: 24, type: PostType.Standard }),
        container.listEvents.execute({ search }),
      ])
    : [[], []];

  const total = posts.length + events.length;

  return (
    <>
      <section className="page-hero page-hero--brand">
        <div className="wrap">
          <h1>Busca</h1>
          <p>Procure por posts, ações e eventos do Raros Boa Vista.</p>
          <form className="busca-form" action="/busca" method="get" role="search">
            <svg className="busca-form-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="search"
              name="q"
              defaultValue={search ?? ""}
              placeholder="Digite o que procura…"
              aria-label="Buscar"
              autoFocus
            />
            <button type="submit">Buscar</button>
          </form>
        </div>
      </section>

      <div className="wrap">
        <section className="section">
          {!search ? (
            <div className="empty-state">Digite algo acima para começar a buscar.</div>
          ) : total === 0 ? (
            <div className="empty-state">
              Nenhum resultado encontrado para <strong>“{search}”</strong>.
            </div>
          ) : (
            <>
              <p className="search-summary" style={{ margin: "0 0 24px", color: "var(--muted)" }}>
                {total} {total === 1 ? "resultado" : "resultados"} para <strong>“{search}”</strong>
              </p>

              {posts.length > 0 && (
                <div style={{ marginBottom: 48 }}>
                  <div className="section-head">
                    <h2>Posts e Ações</h2>
                  </div>
                  <div className="cards-3">
                    {posts.map((p) => (
                      <PostCard post={p} key={p.id} />
                    ))}
                  </div>
                </div>
              )}

              {events.length > 0 && (
                <div>
                  <div className="section-head">
                    <h2>Eventos</h2>
                  </div>
                  <div className="cards-3">
                    {events.map((ev) => {
                      const { day, month } = dayAndMonthAbbr(new Date(ev.startsAt));
                      const online = ev.format === EventFormat.Online;
                      return (
                        <Link className="ev-card" href={`/eventos/${ev.slug}`} key={ev.id} style={{ textDecoration: "none" }}>
                          <div className="media">
                            <ImageSlot src={ev.coverImage} placeholder="" rounded={false} />
                            <span className="datechip">
                              <span className="d">{day}</span>
                              <span className="m">{month}</span>
                            </span>
                          </div>
                          <div className="body">
                            <span className={`fmt${online ? " online" : ""}`}>
                              {online ? "Online" : ev.location ?? "Presencial"}
                            </span>
                            <h3>{ev.title}</h3>
                            {ev.description && <p>{ev.description}</p>}
                            <div className="foot">
                              <span className="date">
                                {formatLongDate(ev.startsAt)} · {hourMinute(new Date(ev.startsAt))}
                              </span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </>
  );
}
