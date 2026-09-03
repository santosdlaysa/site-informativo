"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { createContext, useContext } from "react";

const CompanySlugContext = createContext("raros-boa-vista");

export function CompanyPathProvider({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  return <CompanySlugContext.Provider value={slug}>{children}</CompanySlugContext.Provider>;
}

export function withCompanyPath(slug: string, href: string) {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  if (href === `/${slug}` || href.startsWith(`/${slug}/`) || href.startsWith(`/${slug}?`)) return href;
  return `/${slug}${href === "/" ? "" : href}`;
}

export function useCompanyPath() {
  const slug = useContext(CompanySlugContext);
  return (href: string) => withCompanyPath(slug, href);
}

export function CompanyLink({ href, ...props }: ComponentProps<typeof Link>) {
  const slug = useContext(CompanySlugContext);
  const companyHref =
    typeof href === "string"
      ? withCompanyPath(slug, href)
      : { ...href, pathname: href.pathname ? withCompanyPath(slug, href.pathname) : href.pathname };

  return <Link href={companyHref} {...props} />;
}
