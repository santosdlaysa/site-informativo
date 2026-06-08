import { Skeleton } from "../ui/skeleton";

/** Skeleton para telas de formulário do painel (novo/editar). */
export default function FormSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="page-top">
        <div>
          <Skeleton className="sk-title" w={240} h={26} />
          <Skeleton className="sk-line" w={300} h={14} style={{ marginTop: 10 }} />
        </div>
        <Skeleton className="sk-btn" w={150} />
      </div>

      <div className="form-grid">
        {/* Coluna principal */}
        <div className="panel panel-pad stack">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="field">
              <Skeleton className="sk-line" w={120} h={13} style={{ marginBottom: 8 }} />
              <Skeleton w="100%" h={i === 3 ? 140 : 44} radius={8} />
            </div>
          ))}
        </div>

        {/* Coluna lateral */}
        <div className="stack">
          <div className="panel panel-pad stack">
            <Skeleton className="sk-line" w={100} h={13} style={{ marginBottom: 4 }} />
            <Skeleton w="100%" h={150} radius={10} />
            <Skeleton w="100%" h={44} radius={8} />
            <Skeleton w="100%" h={44} radius={8} />
          </div>
          <div className="panel panel-pad stack">
            <Skeleton className="sk-line" w={120} h={13} />
            <Skeleton w="100%" h={44} radius={8} />
            <Skeleton className="sk-btn" w="100%" />
          </div>
        </div>
      </div>
    </div>
  );
}
