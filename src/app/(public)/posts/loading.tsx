import { PostsListSkeleton } from "@/presentation/components/public/skeletons";

export default function Loading() {
  return (
    <>
      <section className="page-hero page-hero--brand">
        <div className="wrap">
          <h1>Todos os Posts</h1>
          <p>Artigos, tutoriais e notícias sobre tecnologia, saúde e desenvolvimento web.</p>
        </div>
      </section>
      <PostsListSkeleton />
    </>
  );
}
