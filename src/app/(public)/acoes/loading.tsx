import { CardGridSkeleton } from "@/presentation/components/public/skeletons";

export default function Loading() {
  return (
    <>
      <section className="page-hero page-hero--brand">
        <div className="wrap">
          <h1>Ações</h1>
          <p>
            Projetos e iniciativas sociais da comunidade. Conheça as ações que transformam a
            vida de crianças, adolescentes, jovens e suas famílias.
          </p>
        </div>
      </section>
      <div className="wrap">
        <section className="section">
          <CardGridSkeleton count={6} />
        </section>
      </div>
    </>
  );
}
