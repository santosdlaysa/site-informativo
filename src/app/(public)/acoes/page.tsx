import type { Metadata } from "next";
import { container } from "@/infrastructure/container";
import { PostType } from "@/core/domain/post/post-status";
import { PostCard } from "@/presentation/components/public/post-card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ações",
  description:
    "Projetos e iniciativas sociais do Raros Boa Vista / Centro Social: juventude, saúde e apoio a pessoas com doenças raras.",
};

export default async function AcoesPage() {
  const posts = await container.listPublishedPosts.execute({
    take: 24,
    type: PostType.Standard,
  });

  return (
    <>
      <section className="page-hero page-hero--brand">
        <div className="wrap">
          <p className="eyebrow">Ações</p>
          <h1>Ações</h1>
          <p>
            Projetos e iniciativas sociais do Raros Boa Vista. Conheça as ações que transformam a
            vida de crianças, adolescentes, jovens e suas famílias.
          </p>
        </div>
      </section>

      <div className="wrap">
        <section className="section">
          {posts.length === 0 ? (
            <div className="empty-state">Nenhuma ação publicada por enquanto.</div>
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
