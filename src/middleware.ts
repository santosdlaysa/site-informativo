import NextAuth from "next-auth";
import { authConfig } from "@/infrastructure/auth/auth.config";
import { NextRequest, NextResponse } from "next/server";

const { auth: authMiddleware } = NextAuth(authConfig);
const COMPANY_SLUGS = new Set(["raros-boa-vista", "adsocial"]);
const PUBLIC_COMPANY_SLUG_COOKIE = "public-company-slug";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) return authMiddleware(request as any);

  // Arquivos públicos (logos, imagens, manifestos etc.) não participam do roteamento.
  if (/\.[a-z0-9]+$/i.test(pathname)) return NextResponse.next();

  const segments = pathname.split("/").filter(Boolean);
  const companySlug = segments[0];

  if (companySlug && COMPANY_SLUGS.has(companySlug)) {
    const destination = request.nextUrl.clone();
    destination.pathname = `/${segments.slice(1).join("/")}` || "/";
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-company-slug", companySlug);
    const response = NextResponse.rewrite(destination, { request: { headers: requestHeaders } });
    response.cookies.set(PUBLIC_COMPANY_SLUG_COOKIE, companySlug, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
    return response;
  }

  // URLs públicas sem empresa são encaminhadas para a empresa atual ou para
  // Raros Boa Vista, que é a empresa padrão.
  const referer = request.headers.get("referer");
  let refererSlug: string | undefined;
  if (referer) {
    try {
      const firstSegment = new URL(referer).pathname.split("/").filter(Boolean)[0];
      if (firstSegment && COMPANY_SLUGS.has(firstSegment)) refererSlug = firstSegment;
    } catch {
      // Referer inválido: segue com cookie ou empresa padrão.
    }
  }
  const selectedSlug = request.cookies.get(PUBLIC_COMPANY_SLUG_COOKIE)?.value;
  const targetSlug = refererSlug ?? (selectedSlug && COMPANY_SLUGS.has(selectedSlug) ? selectedSlug : "raros-boa-vista");
  const destination = request.nextUrl.clone();
  destination.pathname = `/${targetSlug}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(destination);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
