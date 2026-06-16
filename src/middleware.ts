import NextAuth from "next-auth";
import { authConfig } from "@/infrastructure/auth/auth.config";
import { NextRequest, NextResponse } from "next/server";

const { auth: authMiddleware } = NextAuth(authConfig);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Se o site estiver em manutenção, redireciona rotas públicas para a página de manutenção
  if (process.env.SITE_MAINTENANCE === "true" && !pathname.startsWith("/admin")) {
    if (pathname !== "/maintenance") {
      return NextResponse.redirect(new URL("/maintenance", request.url));
    }
  }

  // Proteção de borda para o painel: roda o callback `authorized` da authConfig
  // antes de qualquer rota `/admin/*` ser renderizada. Complementa (não substitui)
  // a guarda server-side do layout `(panel)`.
  return authMiddleware(request as any);
}

export const config = {
  matcher: ["/admin/:path*"],
};
