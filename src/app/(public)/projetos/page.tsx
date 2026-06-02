import Link from "next/link";
import type { Metadata } from "next";
import { container } from "@/infrastructure/container";
import { PostStatus } from "@/core/domain/post/post-status";
import { ImageSlot } from "@/presentation/components/image-slot";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Projetos" };

export default async function ProjetosPage() {
  const projects = (await container.listProjects.execute()).filter(
    (p) => p.status === PostStatus.Published,
  );

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <p className="eyebrow">Coleções</p>
          <h1>Projetos</h1>
          <p>Coleções de projetos e tutoriais. Abra uma coleção para navegar pela galeria.</p>
        </div>
      </section>

      <div className="wrap">
        <section className="section">
          {projects.length === 0 ? (
            <div className="empty-state">Nenhuma coleção publicada por enquanto.</div>
          ) : (
            <div className="cards-3">
              {projects.map((p) => (
                <Link className="card" href={`/projetos/${p.slug}`} key={p.id}>
                  <div className="thumb">
                    <ImageSlot src={p.coverImage} placeholder="" rounded={false} />
                  </div>
                  <div className="body">
                    <h3>{p.title}</h3>
                    {p.excerpt && <p>{p.excerpt}</p>}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
