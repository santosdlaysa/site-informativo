import { cookies, headers } from "next/headers";
import { prisma } from "./database/prisma";

// Seleção exclusiva do painel. O site público principal permanece na empresa
// padrão até possuir um domínio/rota própria para cada empresa.
export const ACTIVE_COMPANY_COOKIE = "admin-active-company";
export const PUBLIC_COMPANY_COOKIE = "public-active-company";
export const PUBLIC_COMPANY_SLUG_COOKIE = "public-company-slug";
export const DEFAULT_COMPANY_ID = "default";

export async function getActiveCompanyId(): Promise<string> {
  const requestCompanySlug = (await headers()).get("x-company-slug");
  if (requestCompanySlug) {
    const company = await prisma.company.findUnique({ where: { slug: requestCompanySlug }, select: { id: true } });
    return company?.id ?? DEFAULT_COMPANY_ID;
  }
  const cookieStore = await cookies();
  const value = cookieStore.get(ACTIVE_COMPANY_COOKIE)?.value ?? cookieStore.get(PUBLIC_COMPANY_COOKIE)?.value;
  if (!value) return DEFAULT_COMPANY_ID;
  const company = await prisma.company.findUnique({ where: { id: value }, select: { id: true } });
  return company?.id ?? DEFAULT_COMPANY_ID;
}

export async function listCompanies() {
  return prisma.company.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, slug: true, logo: true, primaryColor: true, secondaryColor: true } });
}

export async function getActiveCompany() {
  const id = await getActiveCompanyId();
  return prisma.company.findUnique({ where: { id }, select: { id: true, name: true, slug: true, logo: true, primaryColor: true, secondaryColor: true } });
}
