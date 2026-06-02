import Link from "next/link";
import type { Metadata } from "next";
import { container } from "@/infrastructure/container";
import { PostType } from "@/core/domain/post/post-status";
import { PostCard } from "@/presentation/components/public/post-card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Posts",
  description: "Artigos, tutoriais e notícias sobre tecnologia, saúde e desenvolvimento web.",
};

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;

  const [posts, categories] = await Promise.all([
    container.listPublishedPosts.execute({ categorySlug: categoria, take: 24, type: PostType.Standard }),
    container.listCategories.execute(),
  ]);

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <p className="eyebrow">Blog</p>
          <h1>Todos os Posts</h1>
          <p>Artigos, tutoriais e notícias sobre tecnologia, saúde e desenvolvimento web.</p>
        </div>
      </section>

      <div className="wrap">
        <div className="posts-layout">
          <main>
            <div className="chips">
              <Link className={`chip${!categoria ? " active" : ""}`} href="/posts">
                Todos
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  className={`chip${categoria === c.slug ? " active" : ""}`}
                  href={`/posts?categoria=${c.slug}`}
                >
                  {c.name}
                </Link>
              ))}
            </div>

            {posts.length > 0 ? (
              <div className="cards-3">
                {posts.map((p) => (
                  <PostCard post={p} key={p.id} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                Nenhum post publicado nesta categoria por enquanto.
              </div>
            )}
          </main>

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
            <div className="sidebar-box">
              <h3>Tags populares</h3>
              <div className="tag-cloud">
                {["Next.js", "Prisma", "React", "PostgreSQL", "CSS", "Saúde", "Vercel", "TypeScript"].map(
                  (t) => (
                    <span className="tag" key={t}>
                      {t}
                    </span>
                  ),
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
