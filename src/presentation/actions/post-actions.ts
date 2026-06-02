"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/infrastructure/auth/auth";
import { container } from "@/infrastructure/container";
import { PostStatus, PostType } from "@/core/domain/post/post-status";
import { DomainError } from "@/core/domain/shared/errors";

export interface PostFormState {
  error?: string;
}

const formSchema = z.object({
  title: z.string().trim().min(3, "O título deve ter ao menos 3 caracteres."),
  excerpt: z.string().trim().optional().or(z.literal("")),
  content: z.string().optional().or(z.literal("")),
  categoryId: z.string().optional().or(z.literal("")),
  coverImage: z.string().optional().or(z.literal("")),
  status: z.nativeEnum(PostStatus).optional(),
  type: z.nativeEnum(PostType).optional(),
});

function parse(formData: FormData) {
  return formSchema.safeParse({
    title: formData.get("title"),
    excerpt: formData.get("excerpt") ?? "",
    content: formData.get("content") ?? "",
    categoryId: formData.get("categoryId") ?? "",
    coverImage: formData.get("coverImage") ?? "",
    status: (formData.get("status") as PostStatus) || undefined,
    type: (formData.get("type") as PostType) || undefined,
  });
}

export async function createPostAction(
  _prev: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Sessão expirada. Entre novamente." };

  const parsed = parse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  try {
    await container.createPost.execute({
      title: parsed.data.title,
      excerpt: parsed.data.excerpt || null,
      content: parsed.data.content || "",
      categoryId: parsed.data.categoryId || null,
      coverImage: parsed.data.coverImage || null,
      status: parsed.data.status,
      type: parsed.data.type,
      authorId: session.user.id,
    });
  } catch (error) {
    if (error instanceof DomainError) return { error: error.message };
    throw error;
  }

  revalidatePath("/admin/posts");
  revalidatePath("/posts");
  redirect("/admin/posts");
}

export async function updatePostAction(
  id: string,
  _prev: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Sessão expirada. Entre novamente." };

  const parsed = parse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  try {
    await container.updatePost.execute({
      id,
      title: parsed.data.title,
      excerpt: parsed.data.excerpt || null,
      content: parsed.data.content || "",
      categoryId: parsed.data.categoryId || null,
      coverImage: parsed.data.coverImage || null,
      status: parsed.data.status,
      type: parsed.data.type,
    });
  } catch (error) {
    if (error instanceof DomainError) return { error: error.message };
    throw error;
  }

  revalidatePath("/admin/posts");
  revalidatePath("/posts");
  redirect("/admin/posts");
}

export async function deletePostAction(id: string): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) return;

  await container.deletePost.execute(id);
  revalidatePath("/admin/posts");
  revalidatePath("/posts");
}
