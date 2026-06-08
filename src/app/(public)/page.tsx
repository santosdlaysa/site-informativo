import Link from "next/link";
import Image from "next/image";
import { container } from "@/infrastructure/container";
import { PostType } from "@/core/domain/post/post-status";
import { ImageSlot } from "@/presentation/components/image-slot";
import { PostCard } from "@/presentation/components/public/post-card";
import { formatLongDate } from "@/presentation/lib/format";
import equipeImg from "@/assets/img.png";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [posts, categories, settings] = await Promise.all([
    container.listPublishedPosts.execute({ take: 12, type: PostType.Standard }),
    container.listCategories.execute(),
    container.getSettings.execute(),
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
              <Link href={settings.heroCta2Href} className="home-btn-ghost">{settings.heroCta2Text}</Link>
            </div>
          </div>
          <button className="home-hero-arrow" aria-label="Próximo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width={22} height={22}>
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
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
              <p className="qs-body">{settings.qsBody2}</p>
              <div className="qs-features">
                <div className="qs-feature">
                  <span className="qs-feature-check">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width={12} height={12}><polyline points="20 6 9 17 4 12" /></svg>
                  </span>
                  <div>
                    <strong>{settings.qsFeature1Title}</strong>
                    <span>{settings.qsFeature1Desc}</span>
                  </div>
                </div>
                <div className="qs-feature">
                  <span className="qs-feature-check">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width={12} height={12}><polyline points="20 6 9 17 4 12" /></svg>
                  </span>
                  <div>
                    <strong>{settings.qsFeature2Title}</strong>
                    <span>{settings.qsFeature2Desc}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="qs-img-wrap">
              <div className="qs-img-box">
                {settings.qsImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={settings.qsImage} alt="Equipe Raros e Jovens" style={{ objectFit: "cover", width: "100%", height: "100%" }} />
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

              <aside className="sidebar-box">
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
              </aside>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
