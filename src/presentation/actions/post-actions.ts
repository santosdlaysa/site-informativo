"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/infrastructure/auth/auth";
import { container } from "@/infrastructure/container";
import { PostStatus } from "@/core/domain/post/post-status";
import { DomainError } from "@/core/domain/shared/errors";
import { normalizeUserRole } from "@/core/domain/user/user-role";
import type { GalleryItemInput } from "@/core/domain/project/project.repository";

export interface PostFormState {
  error?: string;
}

const itemSchema = z.object({
  image: z.string().nullable().optional(),
  caption: z.string().nullable().optional(),
  linkedPostId: z.string().nullable().optional(),
});

const formSchema = z.object({
  title: z.string().trim().min(3, "O título deve ter ao menos 3 caracteres."),
  excerpt: z.string().trim().optional().or(z.literal("")),
  content: z.string().optional().or(z.literal("")),
  categoryId: z.string().optional().or(z.literal("")),
  newCategory: z.string().trim().optional().or(z.literal("")),
  coverImage: z.string().optional().or(z.literal("")),
  status: z.nativeEnum(PostStatus).optional(),
  items: z.string().optional(),
});

function parse(formData: FormData) {
  return formSchema.safeParse({
    title: formData.get("title"),
    excerpt: formData.get("excerpt") ?? "",
    content: formData.get("content") ?? "",
    categoryId: formData.get("categoryId") ?? "",
    newCategory: formData.get("newCategory") ?? "",
    coverImage: formData.get("coverImage") ?? "",
    status: (formData.get("status") as PostStatus) || undefined,
    items: (formData.get("items") as string) ?? undefined,
  });
}

/**
 * Resolve o id da categoria a usar: se o usuário digitou uma categoria nova,
 * cria (ou reaproveita) e retorna seu id; senão devolve o id selecionado.
 */
async function resolveCategoryId(
  categoryId: string,
  newCategory: string,
): Promise<string | null> {
  const name = newCategory.trim();
  if (name) {
    const created = await container.categoryRepository.create(name);
    return created.id;
  }
  return categoryId || null;
}

/**
 * Galeria opcional: lê o JSON do campo `items`, descarta entradas vazias
 * (sem imagem nem vínculo) e atribui a posição pela ordem.
 */
function parseGallery(raw: string | undefined): GalleryItemInput[] {
  if (!raw) return [];
  try {
    const result = z.array(itemSchema).safeParse(JSON.parse(raw));
    if (!result.success) return [];
    return result.data
      .filter((it) => it.image || it.linkedPostId)
      .map((it, i) => ({
        image: it.image ?? null,
        caption: it.caption ?? null,
        linkedPostId: it.linkedPostId ?? null,
        position: i,
      }));
  } catch {
    return [];
  }
}

function canWritePost(role: string | undefined | null): boolean {
  const normalizedRole = normalizeUserRole(role);
  return normalizedRole === "admin" || normalizedRole === "editor";
}

function canManagePost(
  role: string | undefined | null,
  currentUserId: string,
  authorId: string,
): boolean {
  const normalizedRole = normalizeUserRole(role);
  return normalizedRole === "admin" || (normalizedRole === "editor" && authorId === currentUserId);
}

export async function createPostAction(
  _prev: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Sessão expirada. Entre novamente." };
  if (!canWritePost(session.user.role)) return { error: "Você não tem permissão para criar posts." };

  const parsed = parse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  try {
    const categoryId = await resolveCategoryId(
      parsed.data.categoryId ?? "",
      parsed.data.newCategory ?? "",
    );
    const { id } = await container.createPost.execute({
      title: parsed.data.title,
      excerpt: parsed.data.excerpt || null,
      content: parsed.data.content || "",
      categoryId,
      coverImage: parsed.data.coverImage || null,
      status: parsed.data.status,
      authorId: session.user.id,
    });
    await container.projectRepository.replaceGallery(id, parseGallery(parsed.data.items));
  } catch (error) {
    if (error instanceof DomainError) return { error: error.message };
    throw error;
  }

  revalidatePath("/admin/posts");
  revalidatePath("/posts");
  redirect("/admin/posts?toast=post-created");
}

export async function updatePostAction(
  id: string,
  _prev: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Sessão expirada. Entre novamente." };

  const post = await container.postRepository.findEntityById(id);
  if (!post || !canManagePost(session.user.role, session.user.id, post.toSnapshot().authorId)) {
    return { error: "Você não tem permissão para editar este post." };
  }

  const parsed = parse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  try {
    const categoryId = await resolveCategoryId(
      parsed.data.categoryId ?? "",
      parsed.data.newCategory ?? "",
    );
    await container.updatePost.execute({
      id,
      title: parsed.data.title,
      excerpt: parsed.data.excerpt || null,
      content: parsed.data.content || "",
      categoryId,
      coverImage: parsed.data.coverImage || null,
      status: parsed.data.status,
    });
    await container.projectRepository.replaceGallery(id, parseGallery(parsed.data.items));
  } catch (error) {
    if (error instanceof DomainError) return { error: error.message };
    throw error;
  }

  revalidatePath("/admin/posts");
  revalidatePath("/posts");
  redirect("/admin/posts?toast=post-updated");
}

export async function deletePostAction(id: string): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) return;

  const post = await container.postRepository.findEntityById(id);
  if (!post || !canManagePost(session.user.role, session.user.id, post.toSnapshot().authorId)) return;

  await container.deletePost.execute(id);
  revalidatePath("/admin/posts");
  revalidatePath("/posts");
}

export async function deleteGalleryItemAction(
  postId: string,
  itemId: string,
): Promise<PostFormState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Sessão expirada. Entre novamente." };

  const post = await container.postRepository.findEntityById(postId);
  if (!post || !canManagePost(session.user.role, session.user.id, post.toSnapshot().authorId)) {
    return { error: "Você não tem permissão para editar este post." };
  }

  await container.projectRepository.deleteGalleryItem(postId, itemId);
  revalidatePath(`/admin/posts/${postId}/editar`);
  revalidatePath("/posts");
  return {};
}
