import { ProgramSkeleton } from "@/presentation/components/public/skeletons";

export default function Loading() {
  return (
    <>
      <section className="page-hero page-hero--brand">
        <div className="wrap">
          <h1>Programação</h1>
          <p>
            Acompanhe nossas lives, workshops e bate-papos. Escolha um dia para ver a agenda
            completa.
          </p>
        </div>
      </section>
      <ProgramSkeleton />
    </>
  );
}
