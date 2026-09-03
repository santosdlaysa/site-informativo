import { cookies } from "next/headers";
import { prisma } from "./database/prisma";

export const ACTIVE_COMPANY_COOKIE = "active-company";
export const DEFAULT_COMPANY_ID = "default";

export async function getActiveCompanyId(): Promise<string> {
  const value = (await cookies()).get(ACTIVE_COMPANY_COOKIE)?.value;
  if (!value) return DEFAULT_COMPANY_ID;
  const company = await prisma.company.findUnique({ where: { id: value }, select: { id: true } });
  return company?.id ?? DEFAULT_COMPANY_ID;
}

export async function listCompanies() {
  return prisma.company.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, slug: true } });
}
