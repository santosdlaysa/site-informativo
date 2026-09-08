import { cookies, headers } from "next/headers";
import { prisma } from "./database/prisma";
import { normalizeUserRole } from "@/core/domain/user/user-role";

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

/**
 * Empresa indicada pela URL da requisição (ex.: /adsocial/admin/login), sem
 * considerar cookies. Usada na tela de login para identificar o site de destino.
 */
export async function getCompanyFromRequestSlug() {
  const slug = (await headers()).get("x-company-slug");
  if (!slug) return null;
  return prisma.company.findUnique({
    where: { slug },
    select: { id: true, name: true, slug: true, logo: true },
  });
}

export async function listCompanies() {
  return prisma.company.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, slug: true, logo: true, primaryColor: true, secondaryColor: true } });
}

const COMPANY_SELECT = { id: true, name: true, slug: true, logo: true, primaryColor: true, secondaryColor: true } as const;

/** Ids dos sites que o usuário pode acessar (site padrão + acessos extras). */
export async function getUserCompanyIds(userId: string): Promise<string[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { companyId: true, companyAccesses: { select: { companyId: true } } },
  });
  if (!user) return [];
  return [...new Set([user.companyId, ...user.companyAccesses.map((access) => access.companyId)])];
}

/** Sites disponíveis para o usuário no painel. Administradores acessam todos. */
export async function listAccessibleCompanies(userId: string, role?: string | null) {
  if (normalizeUserRole(role ?? "editor") === "admin") return listCompanies();
  const ids = await getUserCompanyIds(userId);
  if (ids.length === 0) return [];
  return prisma.company.findMany({ where: { id: { in: ids } }, orderBy: { name: "asc" }, select: COMPANY_SELECT });
}

export async function userCanAccessCompany(userId: string, role: string | null | undefined, companyId: string) {
  if (normalizeUserRole(role ?? "editor") === "admin") return true;
  return (await getUserCompanyIds(userId)).includes(companyId);
}

/** Site ativo do usuário: o selecionado, se ele puder acessá-lo; senão o padrão. */
export async function getEffectiveCompanyId(userId: string, role?: string | null): Promise<string> {
  const active = await getActiveCompanyId();
  if (await userCanAccessCompany(userId, role, active)) return active;
  const ids = await getUserCompanyIds(userId);
  return ids[0] ?? DEFAULT_COMPANY_ID;
}

export async function getActiveCompany() {
  const id = await getActiveCompanyId();
  return prisma.company.findUnique({ where: { id }, select: { id: true, name: true, slug: true, logo: true, primaryColor: true, secondaryColor: true } });
}
