"use server";

import { AuthError } from "next-auth";
import { cookies } from "next/headers";
import { signIn, signOut } from "@/infrastructure/auth/auth";
import { prisma } from "@/infrastructure/database/prisma";
import { ACTIVE_COMPANY_COOKIE } from "@/infrastructure/tenant";

export interface LoginState {
  error?: string;
  success?: boolean;
  redirectTo?: string;
}

/** Server action de login - nunca retorna dados sensíveis */
export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = formData.get("email");
  const password = formData.get("password");

  // Validação básica
  if (!email || !password) {
    return { error: "E-mail e senha são obrigatórios." };
  }

  try {
    // Não passa credenciais na URL, apenas faz o signin
    await signIn("credentials", {
      email: String(email),
      password: String(password),
      redirect: false, // Evita exposição na URL
    });

    const user = await prisma.user.findUnique({
      where: { email: String(email).trim().toLowerCase() },
      select: { companyId: true },
    });
    if (!user) return { error: "Usuário não possui empresa vinculada." };

    (await cookies()).set(ACTIVE_COMPANY_COOKIE, user.companyId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/admin",
    });

    return { success: true, redirectTo: "/admin/posts" };
  } catch (error) {
    // Nunca expor detalhes sobre qual campo está errado (email existe? senha incorreta?)
    // Isso previne enumeration attacks
    if (error instanceof AuthError) {
      return { error: "E-mail ou senha inválidos." };
    }

    // Erros inesperados também sem expor detalhes
    console.error("[AUTH_ERROR]", error instanceof Error ? error.message : "Unknown error");
    return { error: "Ocorreu um erro ao processar sua solicitação." };
  }
}

export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: "/admin/login" });
}
