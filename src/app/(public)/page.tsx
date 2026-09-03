import Image from "next/image";
import { container } from "@/infrastructure/container";
import { PostType } from "@/core/domain/post/post-status";
import { ImageSlot } from "@/presentation/components/image-slot";
import { PostCard } from "@/presentation/components/public/post-card";
import { PartnerGroups } from "@/presentation/components/public/qs-partners";
import { CalendarWidget } from "@/presentation/components/public/calendar-widget";
import { TodayCalendarBar } from "@/presentation/components/public/today-calendar-bar";
import { formatLongDate } from "@/presentation/lib/format";
import equipeImg from "@/assets/img.png";
import { CompanyLink as Link } from "@/presentation/components/public/company-link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const _rawNow = new Date();
  const _p = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(_rawNow);
  const now = new Date(
    +_p.find((x) => x.type === "year")!.value,
    +_p.find((x) => x.type === "month")!.value - 1,
    +_p.find((x) => x.type === "day")!.value,
  );
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const [posts, categories, settings, calendarDates] = await Promise.all([
    container.listPublishedPosts.execute({ take: 12, type: PostType.Standard }),
    container.listCategories.execute(),
    container.getSettings.execute(),
    container.listCalendarDatesByMonth.execute(currentYear, currentMonth),
  ]);

  const latest = posts.slice(0, 4);
  const splitPosts = posts.slice(0, 2);
  const splitHeading = splitPosts[0]?.category?.name ?? "Em destaque";

  return (
    <>
      {/* ===== Hero ===== */}
      <section className="home-hero" style={settings.heroBgImage ? { backgroundImage: `url(${settings.heroBgImage})` } : undefined}>
        {settings.heroBgImage && <div className="home-hero-overlay" />}
        <div className="wrap home-hero-inner">
          <div className="home-hero-content">
            <span className="home-hero-tag">{settings.heroTag}</span>
            <h1>
              {settings.heroTitle.split("\n").map((line, i) => (
                <span key={i}>{line}{i < settings.heroTitle.split("\n").length - 1 && <br />}</span>
              ))}
            </h1>
            <p className="home-hero-desc">{settings.heroDesc}</p>
            <div className="home-hero-ctas">
              <Link href={settings.heroCta1Href} className="home-btn-primary">{settings.heroCta1Text}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Stats bar ===== */}
      <div className="home-stats-outer">
        <div className="wrap">
          <div className="home-stats">
            <div className="home-stat">
              <span className="home-stat-icon home-stat-icon--blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={26} height={26}>
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
              </span>
              <strong className="home-stat-num">{settings.stat1Num}</strong>
              <span className="home-stat-label">{settings.stat1Label}</span>
            </div>
            <div className="home-stat">
              <span className="home-stat-icon home-stat-icon--red">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={26} height={26}>
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </span>
              <strong className="home-stat-num">{settings.stat2Num}</strong>
              <span className="home-stat-label">{settings.stat2Label}</span>
            </div>
            <div className="home-stat">
              <span className="home-stat-icon home-stat-icon--purple">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={26} height={26}>
                  <path d="M9 18V5l12-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>
              </span>
              <strong className="home-stat-num">{settings.stat3Num}</strong>
              <span className="home-stat-label">{settings.stat3Label}</span>
            </div>
            <div className="home-stat">
              <span className="home-stat-icon home-stat-icon--green">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={26} height={26}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </span>
              <strong className="home-stat-num">{settings.stat4Num}</strong>
              <span className="home-stat-label">{settings.stat4Label}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Hoje no Calendário Comemorativo ===== */}
      <div className="wrap">
        <TodayCalendarBar dates={calendarDates} today={now} />
      </div>

      {/* ===== Quem Somos ===== */}
      <div className="wrap">
        <section className="qs-section">
          <div className="qs-grid">
            <div>
              <span className="qs-tag">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={14} height={14}>
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {settings.qsTag}
              </span>
              <h2 className="qs-title">{settings.qsTitle}</h2>
              <p className="qs-body">{settings.qsBody1}</p>
              <Link href="/projeto" className="qs-more">
                Saiba mais
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={16} height={16}>
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
              <PartnerGroups settings={settings} />
            </div>
            <div className="qs-img-wrap">
              <div className="qs-img-box" style={settings.qsImage ? { background: "#fff" } : undefined}>
                {settings.qsImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={settings.qsImage} alt="Equipe Raros e Jovens" style={{ objectFit: "contain", width: "100%", height: "100%", padding: 24 }} />
                ) : (
                  <Image src={equipeImg} alt="Equipe Raros e Jovens" fill sizes="(max-width:820px) 100vw, 50vw" style={{ objectFit: "cover" }} />
                )}
              </div>
              <div className="qs-img-glow" />
            </div>
          </div>
        </section>
      </div>

      {latest.length > 0 && (
        <div className="wrap">
          <section className="section">
            <div className="section-head">
              <h2>Últimos Posts</h2>
              <Link className="see-all" href="/posts">
                Ver todos →
              </Link>
            </div>
            <div className="cards-4">
              {latest.map((p) => (
                <PostCard post={p} key={p.id} />
              ))}
            </div>
          </section>
        </div>
      )}

      {splitPosts.length > 0 && (
        <div className="wrap">
          <section className="section" style={{ paddingTop: 8 }}>
            <div className="split">
              <div>
                <div className="section-head">
                  <span className="cat-head">{splitHeading}</span>
                  <Link className="see-all" href="/posts">
                    Ver todos →
                  </Link>
                </div>
                <div className="cat-list">
                  {splitPosts.map((p) => (
                    <article className="cat-post" key={p.id}>
                      <span className="thumb">
                        <ImageSlot src={p.coverImage} placeholder="" rounded={false} />
                      </span>
                      <div>
                        <h3>
                          <Link href={`/posts/${p.slug}`}>{p.title}</Link>
                        </h3>
                        {p.excerpt && <p>{p.excerpt}</p>}
                        <span className="date">{formatLongDate(p.publishedAt ?? p.createdAt)}</span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <aside>
                <div className="sidebar-box">
                  <h3>Categorias</h3>
                  <ul className="cat-links">
                    {categories.map((c) => (
                      <li key={c.id}>
                        <Link href={`/posts?categoria=${c.slug}`}>
                          {c.name} <span className="count">{c.postCount}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="sidebar-box" style={{ marginTop: 16 }}>
                  <CalendarWidget
                    dates={calendarDates}
                    year={currentYear}
                    month={currentMonth}
                  />
                </div>
              </aside>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
