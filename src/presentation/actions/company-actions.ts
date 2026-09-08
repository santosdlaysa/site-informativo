"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { ACTIVE_COMPANY_COOKIE, DEFAULT_COMPANY_ID, userCanAccessCompany } from "@/infrastructure/tenant";
import { auth } from "@/infrastructure/auth/auth";
import { prisma } from "@/infrastructure/database/prisma";

export async function selectCompanyAction(companyId: string) {
  const session = await auth();
  if (!session?.user?.id) return;
  const value = companyId || DEFAULT_COMPANY_ID;
  const company = await prisma.company.findUnique({ where: { id: value }, select: { id: true } });
  if (!company) return;
  // Admin troca para qualquer site; os demais, apenas para os sites liberados.
  if (!(await userCanAccessCompany(session.user.id, session.user.role, company.id))) return;
  (await cookies()).set(ACTIVE_COMPANY_COOKIE, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
  });
  // Remove a versão antiga, que tinha escopo global e contaminava o site público.
  (await cookies()).set("active-company", "", { maxAge: 0, path: "/" });
  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");
}
