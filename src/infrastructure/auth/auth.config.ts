import type { NextAuthConfig } from "next-auth";

/**
 * Configuração base do Auth.js, sem provedores que dependem de Node (Prisma,
 * bcrypt). É a parte segura para rodar no Edge Runtime do `middleware.ts`.
 * O `auth.ts` estende esta config adicionando o provedor Credentials.
 */
export const authConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [],
  callbacks: {
    /**
     * Usado pelo middleware: protege todo `/admin/*` na borda, exceto a tela
     * de login. Sem sessão → Auth.js redireciona para `pages.signIn`.
     */
    authorized({ auth, request: { nextUrl } }) {
      const { pathname } = nextUrl;
      const isOnAdmin = pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");
      if (!isOnAdmin) return true;
      return !!auth?.user;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        if (typeof token.id === "string") session.user.id = token.id;
        if (typeof token.role === "string") session.user.role = token.role;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
