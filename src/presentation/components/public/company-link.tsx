"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { createContext, useContext } from "react";

const CompanyContext = createContext({ slug: "raros-boa-vista", useSlugPrefix: true });

export function CompanyPathProvider({
  slug,
  useSlugPrefix = true,
  children,
}: {
  slug: string;
  useSlugPrefix?: boolean;
  children: React.ReactNode;
}) {
  return <CompanyContext.Provider value={{ slug, useSlugPrefix }}>{children}</CompanyContext.Provider>;
}

export function withCompanyPath(slug: string, href: string, useSlugPrefix = true) {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  if (!useSlugPrefix) return href;
  if (href === `/${slug}` || href.startsWith(`/${slug}/`) || href.startsWith(`/${slug}?`)) return href;
  return `/${slug}${href === "/" ? "" : href}`;
}

export function useCompanyPath() {
  const { slug, useSlugPrefix } = useContext(CompanyContext);
  return (href: string) => withCompanyPath(slug, href, useSlugPrefix);
}

export function CompanyLink({ href, ...props }: ComponentProps<typeof Link>) {
  const { slug, useSlugPrefix } = useContext(CompanyContext);
  const companyHref =
    typeof href === "string"
      ? withCompanyPath(slug, href, useSlugPrefix)
      : { ...href, pathname: href.pathname ? withCompanyPath(slug, href.pathname, useSlugPrefix) : href.pathname };

  return <Link href={companyHref} {...props} />;
}
