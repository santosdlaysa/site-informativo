/**
 * Fallback de carregamento do painel: exibido automaticamente pelo Next.js
 * enquanto a próxima página (editar, novo, listas) busca dados no servidor.
 * A barra lateral permanece; apenas a área de conteúdo mostra o spinner.
 */
export default function PanelLoading() {
  return (
    <div className="loading-state">
      <span className="spinner" />
      <span>Carregando...</span>
    </div>
  );
}
