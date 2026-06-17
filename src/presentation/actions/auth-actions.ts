"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/infrastructure/auth/auth";

export interface LoginState {
  error?: string;
  success?: boolean;
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

    // Se chegou aqui, sucesso - retorna apenas flag, não dados
    return { success: true };
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
