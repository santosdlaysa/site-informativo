import NextAuth from "next-auth";
import { authConfig } from "@/infrastructure/auth/auth.config";
import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_DOMAIN,
  getCompanySlugFromHostname,
  isAdminHostname,
} from "@/infrastructure/site-domains";

const { auth: authMiddleware } = NextAuth(authConfig);
const COMPANY_SLUGS = new Set(["raros-boa-vista", "adsocial"]);
const PUBLIC_COMPANY_SLUG_COOKIE = "public-company-slug";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get("host");
  const domainCompanySlug = getCompanySlugFromHostname(hostname);

  // Arquivos públicos (logos, imagens, manifestos etc.) não participam do roteamento.
  if (/\.[a-z0-9]+$/i.test(pathname)) return NextResponse.next();

  // movieag.com.br é exclusivo do painel administrativo.
  if (isAdminHostname(hostname)) {
    if (!pathname.startsWith("/admin")) {
      const destination = request.nextUrl.clone();
      destination.pathname = "/admin";
      destination.search = "";
      return NextResponse.redirect(destination);
    }
    return authMiddleware(request as any);
  }

  // Os domínios públicos identificam a empresa sem expor o slug na URL.
  if (domainCompanySlug) {
    if (pathname.startsWith("/admin")) {
      const destination = request.nextUrl.clone();
      destination.protocol = "https:";
      destination.hostname = ADMIN_DOMAIN;
      destination.port = "";
      return NextResponse.redirect(destination);
    }

    // Remove URLs antigas como /adsocial/eventos no domínio próprio.
    const segments = pathname.split("/").filter(Boolean);
    if (segments[0] && COMPANY_SLUGS.has(segments[0])) {
      const destination = request.nextUrl.clone();
      destination.pathname = `/${segments.slice(1).join("/")}`;
      return NextResponse.redirect(destination);
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-company-slug", domainCompanySlug);
    requestHeaders.set("x-company-domain-routing", "1");
    const response = NextResponse.next({ request: { headers: requestHeaders } });
    response.cookies.set(PUBLIC_COMPANY_SLUG_COOKIE, domainCompanySlug, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
    return response;
  }

  if (pathname.startsWith("/admin")) return authMiddleware(request as any);

  const segments = pathname.split("/").filter(Boolean);
  const companySlug = segments[0];

  // Login por empresa: /<empresa>/admin/login identifica o site antes de entrar.
  // O restante do painel continua vivendo em /admin, protegido pelo authMiddleware.
  if (companySlug && COMPANY_SLUGS.has(companySlug) && segments[1] === "admin") {
    const rest = segments.slice(2);
    const destination = request.nextUrl.clone();
    if (rest.length !== 1 || rest[0] !== "login") {
      destination.pathname = `/admin${rest.length ? `/${rest.join("/")}` : ""}`;
      return NextResponse.redirect(destination);
    }
    destination.pathname = "/admin/login";
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-company-slug", companySlug);
    return NextResponse.rewrite(destination, { request: { headers: requestHeaders } });
  }

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
