import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { container } from "@/infrastructure/container";
import { PostForm } from "@/presentation/components/admin/post-form";
import { updatePostAction } from "@/presentation/actions/post-actions";
import { updateProjectAction } from "@/presentation/actions/project-actions";
import { PostStatus } from "@/core/domain/post/post-status";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Editar Post — Admin" };

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [post, categories, posts, gallery] = await Promise.all([
    container.postRepository.findDetailById(id),
    container.listCategories.execute(),
    container.listPosts.execute(),
    container.projectRepository.getGallery(id),
  ]);

  if (!post) notFound();

  const currentCategoryId =
    categories.find((c) => c.slug === post.category?.slug)?.id ?? null;

  // Posts disponíveis para vincular aos itens da galeria (exceto o próprio).
  const postOptions = posts
    .filter((p) => p.id !== id)
    .map((p) => ({ id: p.id, title: p.title }));

  // Liga o id às server actions de atualização: (prevState, formData) => ...
  const action = updatePostAction.bind(null, id);
  const projectAction = updateProjectAction.bind(null, id);

  const galleryInitial = {
    title: post.title,
    description: post.excerpt ?? "",
    categoryId: currentCategoryId,
    status: post.status as PostStatus,
    items: gallery.map((g) => ({
      image: g.image,
      caption: g.caption,
      linkedPostId: g.linkedPostId,
    })),
  };

  return (
    <PostForm
      action={action}
      projectAction={projectAction}
      categories={categories}
      post={post}
      currentCategoryId={currentCategoryId}
      postOptions={postOptions}
      galleryInitial={galleryInitial}
    />
  );
}
