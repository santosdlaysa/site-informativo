import type { Metadata } from "next";
import { container } from "@/infrastructure/container";
import { ProjectBuilder } from "@/presentation/components/admin/project-builder";
import { createProjectAction } from "@/presentation/actions/project-actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Nova coleção — Admin" };

export default async function NewProjectPage() {
  const [categories, posts] = await Promise.all([
    container.listCategories.execute(),
    container.listPosts.execute(),
  ]);

  const postOptions = posts.map((p) => ({ id: p.id, title: p.title }));

  return (
    <ProjectBuilder action={createProjectAction} categories={categories} postOptions={postOptions} />
  );
}
