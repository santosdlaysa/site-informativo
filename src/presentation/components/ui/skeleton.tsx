import type { CSSProperties } from "react";

/**
 * Bloco de skeleton reutilizável. Renderiza apenas o "formato" de um elemento
 * enquanto o conteúdo real carrega. Use as classes utilitárias `sk-line`,
 * `sk-title`, `sk-chip`, etc. (definidas em globals.css) ou passe w/h.
 */
export function Skeleton({
  className = "",
  w,
  h,
  radius,
  dark = false,
  style,
}: {
  className?: string;
  w?: number | string;
  h?: number | string;
  radius?: number | string;
  dark?: boolean;
  style?: CSSProperties;
}) {
  return (
    <span
      aria-hidden="true"
      className={`skeleton${dark ? " skeleton--dark" : ""} ${className}`.trim()}
      style={{ width: w, height: h, borderRadius: radius, ...style }}
    />
  );
}
