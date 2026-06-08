import { Skeleton } from "../ui/skeleton";

/** Card de post/ação no formato de `.card`. */
export function CardSkeleton() {
  return (
    <div className="card" aria-hidden="true">
      <div className="thumb">
        <Skeleton dark w="100%" h="100%" radius={0} />
      </div>
      <div className="body">
        <Skeleton className="sk-title" w="85%" />
        <Skeleton className="sk-line" w="100%" />
        <Skeleton className="sk-line" w="65%" />
        <Skeleton className="sk-line" w="40%" style={{ marginTop: 4 }} />
      </div>
    </div>
  );
}

/** Grade de cards (reutilizada por posts, ações, eventos). */
export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="cards-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Linha de "chips" (filtros) no formato de `.chips`. */
export function ChipsSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="chips" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="sk-chip" w={70 + ((i * 17) % 50)} />
      ))}
    </div>
  );
}

/** Conteúdo da página de Posts: grade + sidebar. */
export function PostsListSkeleton() {
  return (
    <div className="wrap">
      <div className="posts-layout">
        <main>
          <ChipsSkeleton count={5} />
          <CardGridSkeleton count={6} />
        </main>
        <aside>
          <div className="sidebar-box">
            <Skeleton className="sk-title" w="60%" style={{ marginBottom: 16 }} />
            <div className="sk-stack">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="sk-line" h={16} w={`${90 - i * 8}%`} />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

/** Artigo (post detalhe) no formato de `.article`. */
export function ArticleSkeleton() {
  return (
    <div className="article-wrap" aria-hidden="true">
      <article className="article">
        <Skeleton className="sk-chip" w={96} style={{ marginBottom: 18 }} />
        <Skeleton className="sk-title" h={40} w="92%" style={{ marginBottom: 12 }} />
        <Skeleton className="sk-title" h={40} w="70%" style={{ marginBottom: 24 }} />
        <div className="meta" style={{ marginBottom: 28 }}>
          <Skeleton className="sk-circle" w={26} h={26} />
          <Skeleton className="sk-line" w={120} h={14} />
          <Skeleton className="sk-line" w={90} h={14} />
        </div>
        <Skeleton w="100%" h={320} radius={12} style={{ marginBottom: 30 }} />
        <div className="sk-stack" style={{ gap: 14 }}>
          {["100%", "97%", "92%", "98%", "60%", "100%", "94%", "75%"].map((w, i) => (
            <Skeleton key={i} className="sk-line" h={15} w={w} />
          ))}
        </div>
      </article>
    </div>
  );
}

/** Evento em destaque no formato de `.feat`. */
export function FeaturedEventSkeleton() {
  return (
    <div className="wrap">
      <article className="feat" aria-hidden="true">
        <div className="media">
          <Skeleton dark w="100%" h="100%" radius={0} />
        </div>
        <div className="content">
          <Skeleton className="sk-chip" w={90} style={{ marginBottom: 14 }} />
          <Skeleton className="sk-title" h={30} w="80%" style={{ marginBottom: 10 }} />
          <Skeleton className="sk-line" w="100%" />
          <Skeleton className="sk-line" w="85%" style={{ marginBottom: 18 }} />
          <Skeleton className="sk-line" w={220} h={16} />
          <Skeleton className="sk-line" w={160} h={16} style={{ marginTop: 10 }} />
          <Skeleton className="sk-btn" style={{ marginTop: 22 }} />
        </div>
      </article>
    </div>
  );
}

/** Página de eventos: destaque + grade. */
export function EventsPageSkeleton() {
  return (
    <>
      <FeaturedEventSkeleton />
      <div className="wrap">
        <section className="section">
          <div className="section-head">
            <Skeleton className="sk-title" w={200} />
          </div>
          <ChipsSkeleton count={3} />
          <CardGridSkeleton count={6} />
        </section>
      </div>
    </>
  );
}

/** Timeline da programação. */
export function ProgramSkeleton() {
  return (
    <div className="wrap" aria-hidden="true">
      <div style={{ padding: "42px 0 56px" }} className="sk-stack">
        <ChipsSkeleton count={4} />
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="sidebar-box"
            style={{ display: "flex", gap: 18, alignItems: "center" }}
          >
            <Skeleton w={70} h={70} radius={12} />
            <div style={{ flex: 1 }} className="sk-stack">
              <Skeleton className="sk-title" h={20} w="50%" />
              <Skeleton className="sk-line" w="80%" />
              <Skeleton className="sk-line" w="35%" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
