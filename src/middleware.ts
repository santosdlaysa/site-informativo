import NextAuth from "next-auth";
import { authConfig } from "@/infrastructure/auth/auth.config";

/**
 * Proteção de borda para o painel: roda o callback `authorized` da authConfig
 * antes de qualquer rota `/admin/*` ser renderizada. Complementa (não substitui)
 * a guarda server-side do layout `(panel)`.
 */
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: ["/admin/:path*"],
};
