import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/infrastructure/auth/auth";
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
  const session = await auth();
  if (!session?.user?.id) redirect("/admin/login");

  const [post, categories, posts, gallery] = await Promise.all([
    container.postRepository.findDetailById(id),
    container.listCategories.execute(),
    container.listPosts.execute(),
    container.projectRepository.getGallery(id),
  ]);

  if (!post) notFound();
  if (post.authorId !== session.user.id) notFound();

  const currentCategoryId =
    categories.find((c) => c.slug === post.category?.slug)?.id ?? null;

  // Posts disponíveis para vincular aos itens da galeria (exceto o próprio).
  const postOptions = posts
    .filter((p) => p.id !== id)
    .map((p) => ({ id: p.id, title: p.title }));

  // Liga o id à server action de atualização: (prevState, formData) => ...
  const action = updatePostAction.bind(null, id);

  const initialItems = gallery.map((g) => ({
    image: g.image,
    caption: g.caption,
    linkedPostId: g.linkedPostId,
  }));

  return (
    <PostForm
      action={action}
      categories={categories}
      post={post}
      currentCategoryId={currentCategoryId}
      postOptions={postOptions}
      initialItems={initialItems}
    />
  );
}
