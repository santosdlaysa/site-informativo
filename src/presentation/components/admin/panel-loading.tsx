/**
 * Estado de carregamento padrão do painel (spinner + texto).
 * Reutilizado pelos arquivos `loading.tsx` de cada rota para que QUALQUER
 * navegação interna (novo, editar, listas) mostre feedback imediato.
 */
export default function PanelLoading() {
  return (
    <div className="loading-state">
      <span className="spinner" />
      <span>Carregando...</span>
    </div>
  );
}
