import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { container } from "@/infrastructure/container";
import { PostForm } from "@/presentation/components/admin/post-form";
import { updatePostAction } from "@/presentation/actions/post-actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Editar Post — Admin" };

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [post, categories] = await Promise.all([
    container.postRepository.findDetailById(id),
    container.listCategories.execute(),
  ]);

  if (!post) notFound();

  const currentCategoryId =
    categories.find((c) => c.slug === post.category?.slug)?.id ?? null;

  // Liga o id à server action de atualização: (prevState, formData) => ...
  const action = updatePostAction.bind(null, id);

  return (
    <PostForm
      action={action}
      categories={categories}
      post={post}
      currentCategoryId={currentCategoryId}
    />
  );
}
