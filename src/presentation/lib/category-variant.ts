/**
 * Mapeia a variante da categoria para a classe de badge do sistema visual
 * (definido em src/styles/public.css). Mantém um fallback seguro.
 */
const KNOWN = new Set(["news", "tec", "saude", "tut", "eventos"]);

export function badgeClass(
  variant: string | undefined,
  opts: { onImg?: boolean; soft?: boolean } = {},
): string {
  const v = variant && KNOWN.has(variant) ? variant : "tec";
  const base = `badge badge--${v}${opts.soft ? "-soft" : ""}`;
  return opts.onImg ? `${base} on-img` : base;
}
