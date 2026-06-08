import { Skeleton } from "../ui/skeleton";

/**
 * Skeleton padrão do painel: cabeçalho + um painel com linhas de tabela.
 * Reutilizado pelos `loading.tsx` das listas (posts, eventos, programação…)
 * para que qualquer navegação mostre o "formato" da tela imediatamente.
 */
export default function PanelLoading() {
  return (
    <div aria-hidden="true">
      <div className="page-top">
        <div>
          <Skeleton className="sk-title" w={220} h={26} />
          <Skeleton className="sk-line" w={300} h={14} style={{ marginTop: 10 }} />
        </div>
        <Skeleton className="sk-btn" w={150} />
      </div>

      <div className="panel">
        <div className="panel-head">
          <Skeleton className="sk-title" w={180} h={18} />
          <Skeleton className="sk-line" w={60} h={14} />
        </div>
        <div style={{ padding: "8px 0" }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "16px 26px",
                borderBottom: "1px solid var(--line-soft)",
              }}
            >
              <Skeleton w={46} h={46} radius={8} />
              <div style={{ flex: 1 }}>
                <Skeleton className="sk-line" w={`${50 + ((i * 13) % 35)}%`} h={14} />
                <Skeleton className="sk-line" w="30%" h={11} style={{ marginTop: 8 }} />
              </div>
              <Skeleton w={80} h={24} radius={7} />
              <Skeleton w={34} h={34} radius={8} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
