import { auth } from "@/infrastructure/auth/auth";
import { prisma } from "@/infrastructure/database/prisma";
import { PUBLIC_COMPANY_COOKIE, PUBLIC_COMPANY_SLUG_COOKIE } from "@/infrastructure/tenant";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "admin") {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const companyId = request.nextUrl.searchParams.get("company");
  const company = companyId
    ? await prisma.company.findFirst({ where: { OR: [{ id: companyId }, { slug: companyId }] }, select: { id: true, slug: true } })
    : null;
  if (!company) return NextResponse.redirect(new URL("/", request.url));

  const response = NextResponse.redirect(new URL(`/${company.slug}`, request.url));
  // Remove cookies antigos da primeira versão multiempresa. Eles eram globais
  // e podiam sobrescrever a empresa escolhida no preview público.
  response.cookies.set("active-company", "", { maxAge: 0, path: "/" });
  response.cookies.set("admin-active-company", "", { maxAge: 0, path: "/" });
  response.cookies.set(PUBLIC_COMPANY_COOKIE, company.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  response.cookies.set(PUBLIC_COMPANY_SLUG_COOKIE, company.slug, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  return response;
}
