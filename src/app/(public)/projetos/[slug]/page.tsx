import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { container } from "@/infrastructure/container";
import { PostStatus } from "@/core/domain/post/post-status";
import { ImageSlot } from "@/presentation/components/image-slot";
import { LinkIcon } from "@/presentation/components/icons";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await container.getProjectBySlug.execute(slug);
  return project ? { title: project.post.title, description: project.post.excerpt ?? undefined } : { title: "Projetos" };
}

export default async function ProjetoGalleryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await container.getProjectBySlug.execute(slug);
  if (!project || project.post.status !== PostStatus.Published) notFound();

  const { post, items } = project;

  return (
    <>
      <section className="proj-hero">
        <nav className="crumb">
          <Link href="/">Home</Link>
          <span>›</span>
          <Link href="/projetos">Projetos</Link>
          <span>›</span>
          <span>{post.title}</span>
        </nav>
        <span className="badge badge--tec-soft">Projetos</span>
        <h1>{post.title}</h1>
        {post.excerpt && <p>{post.excerpt}</p>}
      </section>

      <section className="gallery">
        {items.length === 0 ? (
          <div className="empty-state">Esta coleção ainda não tem itens.</div>
        ) : (
          <div className="gallery-grid">
            {items.map((it) => {
              const href = it.linkedPostSlug ? `/posts/${it.linkedPostSlug}` : "#";
              return (
                <Link className="proj-card" href={href} key={it.id}>
                  <ImageSlot src={it.image} placeholder="img projeto" rounded={false} />
                  <div className="ov" />
                  <span className="arrow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 17 17 7M9 7h8v8" />
                    </svg>
                  </span>
                  <div className="cap">
                    {it.caption && (
                      <div className="k">
                        <LinkIcon width={13} height={13} />
                        {it.caption}
                      </div>
                    )}
                    <h3>{it.linkedPostTitle ?? "Post vinculado"}</h3>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
