"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/infrastructure/auth/auth";
import { container } from "@/infrastructure/container";
import { DomainError } from "@/core/domain/shared/errors";

export interface ProfileFormState {
  error?: string;
  success?: boolean;
}

const formSchema = z.object({
  name: z.string().trim().min(2, "O nome deve ter ao menos 2 caracteres."),
  bio: z.string().trim().optional().or(z.literal("")),
  avatar: z.string().optional().or(z.literal("")),
});

export async function updateProfileAction(
  _prev: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Sessão expirada. Entre novamente." };

  const parsed = formSchema.safeParse({
    name: formData.get("name"),
    bio: formData.get("bio") ?? "",
    avatar: formData.get("avatar") ?? "",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  try {
    await container.updateProfile.execute(session.user.id, {
      name: parsed.data.name,
      bio: parsed.data.bio || null,
      avatar: parsed.data.avatar || null,
    });
  } catch (error) {
    if (error instanceof DomainError) return { error: error.message };
    throw error;
  }

  // O nome/bio do autor aparecem nas páginas públicas dos posts.
  revalidatePath("/posts", "layout");
  revalidatePath("/admin/configuracoes");
  return { success: true };
}
