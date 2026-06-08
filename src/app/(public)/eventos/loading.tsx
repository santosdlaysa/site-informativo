import { EventsPageSkeleton } from "@/presentation/components/public/skeletons";

export default function Loading() {
  return (
    <>
      <section className="page-hero page-hero--brand">
        <div className="wrap">
          <h1>Eventos</h1>
          <p>Encontros, workshops e meetups da comunidade Raros Boa Vista. Participe presencialmente ou online.</p>
        </div>
      </section>
      <EventsPageSkeleton />
    </>
  );
}
