"use client";

import type { CSSProperties, ReactNode } from "react";
import { EditIcon, PlusIcon } from "../icons";

/**
 * Painel do admin cujo formulário fica oculto até a pessoa clicar no botão de ação.
 * Fechado, mostra apenas o cabeçalho (e um resumo do conteúdo atual, quando houver).
 */
export function CollapsiblePanel({
  title,
  actionLabel,
  actionIcon = "edit",
  open,
  onOpenChange,
  summary,
  className,
  style,
  children,
}: {
  title: string;
  actionLabel: string;
  actionIcon?: "edit" | "plus";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  summary?: ReactNode;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const collapsed = !open && !summary;
  return (
    <section className={`panel${collapsed ? " is-collapsed" : ""}${className ? ` ${className}` : ""}`} style={style}>
      <div className="panel-head">
        <h2>{title}</h2>
        {!open && (
          <button type="button" className="btn" onClick={() => onOpenChange(true)}>
            {actionIcon === "plus" ? <PlusIcon /> : <EditIcon />}
            {actionLabel}
          </button>
        )}
      </div>
      {open ? (
        <div className="panel-pad">{children}</div>
      ) : (
        summary && <div className="panel-pad">{summary}</div>
      )}
    </section>
  );
}

export function PanelSummary({ children }: { children: ReactNode }) {
  return <div className="panel-summary">{children}</div>;
}

export function PanelSummaryItem({
  label,
  value,
  multiline = false,
}: {
  label: string;
  value?: string | null;
  multiline?: boolean;
}) {
  const filled = Boolean(value && value.trim());
  return (
    <div>
      <span className="panel-summary-label">{label}</span>
      <p className={`panel-summary-value${multiline ? " panel-summary-text" : ""}${filled ? "" : " panel-summary-empty"}`}>
        {filled ? value : "Não preenchido"}
      </p>
    </div>
  );
}
