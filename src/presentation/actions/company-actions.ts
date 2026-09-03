"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { ACTIVE_COMPANY_COOKIE, DEFAULT_COMPANY_ID } from "@/infrastructure/tenant";
import { auth } from "@/infrastructure/auth/auth";
import { prisma } from "@/infrastructure/database/prisma";

export async function selectCompanyAction(companyId: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "admin") return;
  const value = companyId || DEFAULT_COMPANY_ID;
  const company = await prisma.company.findUnique({ where: { id: value }, select: { id: true } });
  if (!company) return;
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
