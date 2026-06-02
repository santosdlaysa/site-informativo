import Link from "next/link";
import type { Metadata } from "next";
import { container } from "@/infrastructure/container";
import { EventFormat } from "@/core/domain/event/event-format";
import { ImageSlot } from "@/presentation/components/image-slot";
import { badgeClass } from "@/presentation/lib/category-variant";
import { formatLongDate } from "@/presentation/lib/format";
import { dayAndMonthAbbr, hourMinute } from "@/presentation/lib/datetime";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Eventos" };

const FILTERS: { label: string; value?: EventFormat }[] = [
  { label: "Todos" },
  { label: "Online", value: EventFormat.Online },
  { label: "Presencial", value: EventFormat.Presential },
];

function MonitorIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="13" rx="2" />
      <path d="M8 21h8" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export default async function EventosPage({
  searchParams,
}: {
  searchParams: Promise<{ formato?: string }>;
}) {
  const { formato } = await searchParams;
  const format =
    formato === "online" ? EventFormat.Online : formato === "presencial" ? EventFormat.Presential : undefined;

  const [events, categories] = await Promise.all([
    container.listEvents.execute({ format }),
    container.listCategories.execute(),
  ]);
  const variantByName = new Map(categories.map((c) => [c.name.toLowerCase(), c.variant]));

  const featured = events[0] ?? null;
  const rest = events.slice(1);

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <p className="eyebrow">Comunidade</p>
          <h1>Eventos</h1>
          <p>Encontros, workshops e meetups da comunidade MeuBlog. Participe presencialmente ou online.</p>
        </div>
      </section>

      {featured && (
        <div className="wrap">
          <article className="feat">
            <div className="media">
              <ImageSlot src={featured.coverImage} placeholder="Imagem do evento" rounded={false} />
              <span className="badge badge--eventos on-img tag-feat">Em destaque</span>
            </div>
            <div className="content">
              {featured.category && (
                <span
                  className={badgeClass(variantByName.get(featured.category.toLowerCase()), { soft: true })}
                  style={{ alignSelf: "flex-start" }}
                >
                  {featured.category}
                </span>
              )}
              <h2>{featured.title}</h2>
              {featured.description && <p>{featured.description}</p>}
              <div className="ev-info">
                <div className="row">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                  {formatLongDate(featured.startsAt)} · {hourMinute(new Date(featured.startsAt))}
                </div>
                {featured.location && (
                  <div className="row">
                    <PinIcon /> {featured.location}
                  </div>
                )}
              </div>
              <div className="ev-cta">
                <Link className="btn-outline" href={`/eventos/${featured.slug}`}>
                  Ver detalhes
                </Link>
              </div>
            </div>
          </article>
        </div>
      )}

      <div className="wrap">
        <section className="section">
          <div className="section-head">
            <h2>Próximos eventos</h2>
          </div>
          <div className="chips">
            {FILTERS.map((f) => {
              const isActive = (f.value === EventFormat.Online && formato === "online") ||
                (f.value === EventFormat.Presential && formato === "presencial") ||
                (!f.value && !formato);
              const href = f.value
                ? `/eventos?formato=${f.value === EventFormat.Online ? "online" : "presencial"}`
                : "/eventos";
              return (
                <Link key={f.label} className={`chip${isActive ? " active" : ""}`} href={href}>
                  {f.label}
                </Link>
              );
            })}
          </div>

          {rest.length === 0 && !featured ? (
            <div className="empty-state">Nenhum evento cadastrado por enquanto.</div>
          ) : (
            <div className="cards-3">
              {rest.map((ev) => {
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
                        {online ? <MonitorIcon /> : <PinIcon />} {online ? "Online" : ev.location ?? "Presencial"}
                      </span>
                      <h3>{ev.title}</h3>
                      {ev.description && <p>{ev.description}</p>}
                      <div className="foot">
                        <span className="signup">Ver detalhes →</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
