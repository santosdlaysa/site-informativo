import NextAuth from "next-auth";
import { authConfig } from "@/infrastructure/auth/auth.config";
import { NextRequest, NextResponse } from "next/server";

const { auth: authMiddleware } = NextAuth(authConfig);

export async function middleware(request: NextRequest) {
  // Proteção de borda para o painel: roda o callback `authorized` da authConfig
  // antes de qualquer rota `/admin/*` ser renderizada. Complementa (não substitui)
  // a guarda server-side do layout `(panel)`.
  return authMiddleware(request as any);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
