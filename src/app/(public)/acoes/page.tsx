import type { Metadata } from "next";
import { container } from "@/infrastructure/container";
import { PostType } from "@/core/domain/post/post-status";
import { PostCard } from "@/presentation/components/public/post-card";
import { CompanyLink as Link } from "@/presentation/components/public/company-link";
import { getActiveCompany } from "@/infrastructure/tenant";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const company = await getActiveCompany();
  return {
    title: "Ações",
    description: `Projetos e iniciativas sociais do ${company?.name || "Raros Boa Vista"}.`,
  };
}

export default async function AcoesPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;

  const [posts, categories, company] = await Promise.all([
    container.listPublishedPosts.execute({
      categorySlug: categoria,
      take: 24,
      type: PostType.Standard,
    }),
    container.listCategories.execute(),
    getActiveCompany(),
  ]);

  return (
    <>
      <section className="page-hero page-hero--brand">
        <div className="wrap">
          <h1>Ações</h1>
          <p>
            Projetos e iniciativas sociais do {company?.name || "Raros Boa Vista"}. Conheça as ações que transformam a
            vida de crianças, adolescentes, jovens e suas famílias.
          </p>
        </div>
      </section>

      <div className="wrap">
        <section className="section">
          <div className="chips">
            <Link className={`chip${!categoria ? " active" : ""}`} href="/acoes">
              Todos
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                className={`chip${categoria === c.slug ? " active" : ""}`}
                href={`/acoes?categoria=${c.slug}`}
              >
                {c.name}
              </Link>
            ))}
          </div>

          {posts.length === 0 ? (
            <div className="empty-state">
              {categoria
                ? "Nenhuma ação publicada nesta categoria por enquanto."
                : "Nenhuma ação publicada por enquanto."}
            </div>
          ) : (
            <div className="cards-3">
              {posts.map((p) => (
                <PostCard post={p} key={p.id} />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
