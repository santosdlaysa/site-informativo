import Link from "next/link";
import { container } from "@/infrastructure/container";
import { PostType } from "@/core/domain/post/post-status";
import { ImageSlot } from "@/presentation/components/image-slot";
import { PostCard } from "@/presentation/components/public/post-card";
import { badgeClass } from "@/presentation/lib/category-variant";
import { formatLongDate } from "@/presentation/lib/format";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [posts, categories] = await Promise.all([
    container.listPublishedPosts.execute({ take: 12, type: PostType.Standard }),
    container.listCategories.execute(),
  ]);

  const featured = posts[0] ?? null;
  const side = posts.slice(1, 4);
  const latest = posts.slice(0, 4);
  const splitPosts = posts.slice(0, 2);
  const splitHeading = splitPosts[0]?.category?.name ?? "Em destaque";

  return (
    <>
      <div className="wrap">
        <section className="hero-grid">
          {featured ? (
            <Link className="hero" href={`/posts/${featured.slug}`}>
              <ImageSlot className="img" src={featured.coverImage} placeholder="" rounded={false} />
              <div className="scrim" />
              <div className="hero-content">
                {featured.category && (
                  <span className={badgeClass(featured.category.variant, { onImg: true })}>
                    {featured.category.name}
                  </span>
                )}
                <h1>{featured.title}</h1>
                {featured.excerpt && <p className="lead">{featured.excerpt}</p>}
                <div className="meta">
                  <span className="avatar" />
                  <span>{featured.authorName}</span>
                  <span className="dot" />
                  <span>{formatLongDate(featured.publishedAt ?? featured.createdAt)}</span>
                </div>
              </div>
            </Link>
          ) : (
            <div className="hero">
              <div className="scrim" />
              <div className="hero-content">
                <h1>Bem-vindo ao MeuBlog</h1>
                <p className="lead">
                  Ainda não há posts publicados. Acesse o painel para criar o primeiro.
                </p>
              </div>
            </div>
          )}

          <aside className="side-list">
            {side.map((p) => (
              <Link className="side-item" href={`/posts/${p.slug}`} key={p.id}>
                <span className="thumb">
                  <ImageSlot src={p.coverImage} placeholder="" rounded={false} />
                </span>
                <span className="info">
                  {p.category && (
                    <span className={badgeClass(p.category.variant, { soft: true })} style={{ alignSelf: "flex-start" }}>
                      {p.category.name}
                    </span>
                  )}
                  <h4>{p.title}</h4>
                  <span className="date">{formatLongDate(p.publishedAt ?? p.createdAt)}</span>
                </span>
              </Link>
            ))}
          </aside>
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
