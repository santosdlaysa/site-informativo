"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/infrastructure/auth/auth";
import { container } from "@/infrastructure/container";
import { PostStatus } from "@/core/domain/post/post-status";
import { DomainError } from "@/core/domain/shared/errors";
import type { ProjectItemDTO } from "@/core/application/projects/project.usecases";

export interface ProjectFormState {
  error?: string;
}

const itemSchema = z.object({
  image: z.string().nullable().optional(),
  caption: z.string().nullable().optional(),
  linkedPostId: z.string().nullable().optional(),
});

const schema = z.object({
  title: z.string().trim().min(3, "Informe um título com ao menos 3 caracteres."),
  description: z.string().trim().optional(),
  categoryId: z.string().optional(),
  status: z.nativeEnum(PostStatus).optional(),
  items: z.string().optional(),
});

function parseItems(raw: string | undefined): ProjectItemDTO[] {
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    const result = z.array(itemSchema).safeParse(arr);
    return result.success ? result.data : [];
  } catch {
    return [];
  }
}

export async function createProjectAction(
  _prev: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Sessão expirada. Entre novamente." };

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };

  try {
    await container.createProject.execute(
      {
        title: parsed.data.title,
        description: parsed.data.description || null,
        categoryId: parsed.data.categoryId || null,
        status: parsed.data.status,
        items: parseItems(parsed.data.items),
      },
      session.user.id,
    );
  } catch (error) {
    if (error instanceof DomainError) return { error: error.message };
    throw error;
  }

  revalidatePath("/admin/posts");
  revalidatePath("/posts");
  redirect("/admin/posts");
}

export async function updateProjectAction(
  id: string,
  _prev: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Sessão expirada. Entre novamente." };

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };

  try {
    await container.updateProject.execute(id, {
      title: parsed.data.title,
      description: parsed.data.description || null,
      categoryId: parsed.data.categoryId || null,
      status: parsed.data.status,
      items: parseItems(parsed.data.items),
    });
  } catch (error) {
    if (error instanceof DomainError) return { error: error.message };
    throw error;
  }

  revalidatePath("/admin/posts");
  revalidatePath("/posts");
  redirect("/admin/posts");
}
