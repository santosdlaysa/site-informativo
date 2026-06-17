import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { container } from "@/infrastructure/container";
import { auth } from "@/infrastructure/auth/auth";
import { PostStatus, PostType } from "@/core/domain/post/post-status";
import { ImageSlot } from "@/presentation/components/image-slot";
import { PostCard } from "@/presentation/components/public/post-card";
import { PostGallery } from "@/presentation/components/public/post-gallery";
import { badgeClass } from "@/presentation/lib/category-variant";
import { formatLongDate } from "@/presentation/lib/format";
import { ClockIcon } from "@/presentation/components/icons";

export const dynamic = "force-dynamic";

async function loadPost(slug: string) {
  const post = await container.postRepository.findDetailBySlug(slug);
  if (!post) return null;
  // Rascunhos só são visíveis para administradores autenticados (pré-visualização).
  if (post.status !== PostStatus.Published) {
    const session = await auth();
    if (!session?.user?.id) return null;
  }
  return post;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await loadPost(slug);
  if (!post) return { title: "Post não encontrado" };
  return { title: post.title, description: post.excerpt ?? undefined };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await loadPost(slug);
  if (!post) notFound();

  // Galeria de imagens do post (vazia para posts sem galeria).
  const gallery = await container.projectRepository.getGallery(post.id);

  const related = (
    await container.listPublishedPosts.execute({
      categorySlug: post.category?.slug,
      take: 4,
      type: PostType.Standard,
    })
  )
    .filter((p) => p.id !== post.id)
    .slice(0, 3);

  const paragraphs = post.content.split(/\n{2,}/).filter((p) => p.trim());

  return (
    <>
      <article className="article">
        <div className="article-wrap">
          <nav className="crumb">
            <Link href="/">Home</Link>
            <span className="sep">›</span>
            <Link href={post.category ? `/posts?categoria=${post.category.slug}` : "/posts"}>
              {post.category?.name ?? "Posts"}
            </Link>
            <span className="sep">›</span>
            <span className="cur">{post.title}</span>
          </nav>

          {post.category && (
            <span className={badgeClass(post.category.variant, { soft: true })}>
              {post.category.name}
            </span>
          )}
          <h1>{post.title}</h1>
          <div className="meta">
            {post.authorAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.authorAvatar} alt={post.authorName} className="avatar" style={{ objectFit: "cover" }} />
            ) : (
              <span className="avatar" />
            )}
            <span>{post.authorName}</span>
            <span className="dot" />
            <span>{formatLongDate(post.publishedAt ?? post.createdAt)}</span>
            <span className="dot" />
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <ClockIcon width={15} height={15} /> {post.readingTime} min de leitura
            </span>
          </div>

          <div className="cover">
            <ImageSlot src={post.coverImage} placeholder="Imagem de capa do post" rounded={false} />
          </div>

          <div className="body">
            {paragraphs.length > 0 ? (
              paragraphs.map((p, i) => <p key={i}>{p}</p>)
            ) : (
              <p>{post.excerpt}</p>
            )}
          </div>

          {gallery.length > 0 && (
            <div className="post-gallery" style={{ marginTop: 36 }}>
              <h2 style={{ fontSize: 22, marginBottom: 16 }}>Galeria</h2>
              <PostGallery items={gallery} />
            </div>
          )}

          <div className="author-box">
            {post.authorAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.authorAvatar} alt={post.authorName} className="av" style={{ objectFit: "cover" }} />
            ) : (
              <span className="av" />
            )}
            <div>
              <h4>{post.authorName}</h4>
              <p>
                {post.authorBio ?? "Autor do Centro Social"}
              </p>
            </div>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <div className="wrap">
          <section className="related">
            <div className="section-head">
              <h2 style={{ fontSize: 24 }}>Posts relacionados</h2>
              <Link className="see-all" href="/posts">
                Ver todos →
              </Link>
            </div>
            <div className="cards-3">
              {related.map((p) => (
                <PostCard post={p} key={p.id} />
              ))}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
