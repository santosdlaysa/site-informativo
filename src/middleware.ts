import NextAuth from "next-auth";
import { authConfig } from "@/infrastructure/auth/auth.config";
import { NextRequest, NextResponse } from "next/server";

const { auth: authMiddleware } = NextAuth(authConfig);

export async function middleware(request: NextRequest) {
  // Se o site estiver em manutenção, redireciona para a página de manutenção
  if (process.env.SITE_MAINTENANCE === "true") {
    const { pathname } = request.nextUrl;

    // Permite acesso à página de manutenção e assets estáticos
    if (pathname === "/maintenance" || pathname.startsWith("/_next") || pathname.startsWith("/api")) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/maintenance", request.url));
  }

  // Proteção de borda para o painel: roda o callback `authorized` da authConfig
  // antes de qualquer rota `/admin/*` ser renderizada. Complementa (não substitui)
  // a guarda server-side do layout `(panel)`.
  return authMiddleware(request);
}

export const config = {
  matcher: ["/((?!_next|api(?!/auth)|favicon.ico).*)"],
};
