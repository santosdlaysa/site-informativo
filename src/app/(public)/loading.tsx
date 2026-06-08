import { Skeleton } from "@/presentation/components/ui/skeleton";
import { CardGridSkeleton } from "@/presentation/components/public/skeletons";

export default function Loading() {
  return (
    <>
      {/* Hero */}
      <section className="page-hero page-hero--brand" aria-hidden="true">
        <div className="wrap">
          <Skeleton className="sk-chip" w={170} style={{ background: "rgba(255,255,255,.35)", marginBottom: 18 }} />
          <Skeleton h={44} w="70%" radius={10} style={{ background: "rgba(255,255,255,.45)", marginBottom: 12 }} />
          <Skeleton h={44} w="55%" radius={10} style={{ background: "rgba(255,255,255,.45)", marginBottom: 22 }} />
          <Skeleton h={16} w="60%" style={{ background: "rgba(255,255,255,.3)" }} />
          <Skeleton h={16} w="45%" style={{ background: "rgba(255,255,255,.3)", marginTop: 10 }} />
        </div>
      </section>

      {/* Seção de cards */}
      <div className="wrap">
        <section className="section">
          <div className="section-head">
            <Skeleton className="sk-title" w={220} />
            <Skeleton className="sk-line" w={90} h={16} />
          </div>
          <CardGridSkeleton count={3} />
        </section>
      </div>
    </>
  );
}
