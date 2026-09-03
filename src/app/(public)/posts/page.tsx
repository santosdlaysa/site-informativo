import type { Metadata } from "next";
import { container } from "@/infrastructure/container";
import { PostType } from "@/core/domain/post/post-status";
import { PostCard } from "@/presentation/components/public/post-card";
import { CompanyLink as Link } from "@/presentation/components/public/company-link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Posts",
  description: "Artigos, tutoriais e notícias sobre tecnologia, saúde e desenvolvimento web.",
};

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; busca?: string }>;
}) {
  const { categoria, busca } = await searchParams;
  const search = busca?.trim() || undefined;

  const [posts, categories] = await Promise.all([
    container.listPublishedPosts.execute({
      categorySlug: categoria,
      search,
      take: 24,
      type: PostType.Standard,
    }),
    container.listCategories.execute(),
  ]);

  return (
    <>
      <section className="page-hero page-hero--brand">
        <div className="wrap">
          <h1>Todos os Posts</h1>
          <p>Artigos, tutoriais e notícias sobre tecnologia, saúde e desenvolvimento web.</p>
        </div>
      </section>

      <div className="wrap">
        <div className="posts-layout">
          <main>
            <div className="chips">
              <Link className={`chip${!categoria && !search ? " active" : ""}`} href="/posts">
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

            {search && (
              <p className="search-summary" style={{ margin: "0 0 18px", color: "var(--muted)" }}>
                {posts.length} {posts.length === 1 ? "resultado" : "resultados"} para{" "}
                <strong>“{search}”</strong> · <Link href="/posts">limpar busca</Link>
              </p>
            )}

            {posts.length > 0 ? (
              <div className="cards-3">
                {posts.map((p) => (
                  <PostCard post={p} key={p.id} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                {search
                  ? "Nenhum post encontrado para a sua busca."
                  : "Nenhum post publicado nesta categoria por enquanto."}
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
          </aside>
        </div>
      </div>
    </>
  );
}
