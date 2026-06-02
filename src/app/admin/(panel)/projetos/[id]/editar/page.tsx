import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { container } from "@/infrastructure/container";
import { PostStatus } from "@/core/domain/post/post-status";
import { ProjectBuilder } from "@/presentation/components/admin/project-builder";
import { updateProjectAction } from "@/presentation/actions/project-actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Editar coleção — Admin" };

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [project, categories, posts] = await Promise.all([
    container.getProjectForEdit.execute(id),
    container.listCategories.execute(),
    container.listPosts.execute(),
  ]);

  if (!project) notFound();

  const { post, items } = project;
  const currentCategoryId = categories.find((c) => c.slug === post.category?.slug)?.id ?? null;
  const postOptions = posts.filter((p) => p.id !== id).map((p) => ({ id: p.id, title: p.title }));

  const action = updateProjectAction.bind(null, id);

  return (
    <ProjectBuilder
      action={action}
      categories={categories}
      postOptions={postOptions}
      isEdit
      initial={{
        title: post.title,
        description: post.excerpt ?? "",
        categoryId: currentCategoryId,
        status: post.status as PostStatus,
        items: items.map((it) => ({
          image: it.image,
          caption: it.caption,
          linkedPostId: it.linkedPostId,
        })),
      }}
    />
  );
}
