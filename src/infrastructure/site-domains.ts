export const ADMIN_DOMAIN = "movieag.com.br";

export const COMPANY_DOMAIN_BY_SLUG = {
  adsocial: "adsocialoficial.org",
  "raros-boa-vista": "rarosboavista.com.br",
} as const;

export type CompanySlug = keyof typeof COMPANY_DOMAIN_BY_SLUG;

export function normalizeHostname(host: string | null | undefined): string {
  return (host ?? "")
    .trim()
    .toLowerCase()
    .replace(/:\d+$/, "")
    .replace(/^www\./, "");
}

export function isAdminHostname(host: string | null | undefined): boolean {
  return normalizeHostname(host) === ADMIN_DOMAIN;
}

export function getCompanySlugFromHostname(host: string | null | undefined): CompanySlug | null {
  const hostname = normalizeHostname(host);
  const entry = Object.entries(COMPANY_DOMAIN_BY_SLUG).find(([, domain]) => domain === hostname);
  return (entry?.[0] as CompanySlug | undefined) ?? null;
}

export function getCompanyDomain(slug: string): string | null {
  return COMPANY_DOMAIN_BY_SLUG[slug as CompanySlug] ?? null;
}
