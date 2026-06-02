"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/infrastructure/auth/auth";

export interface LoginState {
  error?: string;
}

/** Server action de login usada pelo formulário com useActionState. */
export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin/posts",
    });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "E-mail ou senha inválidos." };
    }
    // Re-lança o redirect interno do Next (NEXT_REDIRECT) para concluir o login.
    throw error;
  }
}

export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: "/admin/login" });
}
