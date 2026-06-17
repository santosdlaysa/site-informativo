"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/infrastructure/auth/auth";
import { container } from "@/infrastructure/container";
import { DomainError } from "@/core/domain/shared/errors";

export interface UserFormState {
  error?: string;
  success?: boolean;
}

const createSchema = z.object({
  name: z.string().trim().min(2, "O nome deve ter ao menos 2 caracteres."),
  email: z.string().trim().email("E-mail inválido."),
  password: z.string().min(6, "A senha deve ter ao menos 6 caracteres."),
});

const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Informe sua senha atual."),
    newPassword: z.string().min(6, "A nova senha deve ter ao menos 6 caracteres."),
    confirmPassword: z.string().min(1, "Confirme a nova senha."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "A confirmação não confere com a nova senha.",
    path: ["confirmPassword"],
  });

export async function createUserAction(
  _prev: UserFormState,
  formData: FormData,
): Promise<UserFormState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Sessão expirada. Entre novamente." };

  const parsed = createSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  try {
    await container.createUser.execute(
      parsed.data.name,
      parsed.data.email,
      parsed.data.password,
    );
  } catch (error) {
    if (error instanceof DomainError) return { error: error.message };
    throw error;
  }

  revalidatePath("/admin/editores");
  return { success: true };
}

export async function deleteUserAction(id: string): Promise<UserFormState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Sessão expirada. Entre novamente." };
  if (session.user.role !== "admin") return { error: "Apenas o administrador pode remover editores." };

  try {
    await container.deleteUser.execute(id, session.user.id, session.user.role ?? "editor");
  } catch (error) {
    if (error instanceof DomainError) return { error: error.message };
    throw error;
  }

  revalidatePath("/admin/editores");
  return { success: true };
}

export async function updateOwnPasswordAction(
  _prev: UserFormState,
  formData: FormData,
): Promise<UserFormState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Sessão expirada. Entre novamente." };

  const parsed = updatePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  try {
    await container.updateOwnPassword.execute(
      session.user.id,
      parsed.data.currentPassword,
      parsed.data.newPassword,
    );
  } catch (error) {
    if (error instanceof DomainError) return { error: error.message };
    throw error;
  }

  revalidatePath("/admin/configuracoes");
  return { success: true };
}
