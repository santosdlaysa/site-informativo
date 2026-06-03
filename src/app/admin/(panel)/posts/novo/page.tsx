import type { Metadata } from "next";
import { container } from "@/infrastructure/container";
import { PostForm } from "@/presentation/components/admin/post-form";
import { createPostAction } from "@/presentation/actions/post-actions";
import { createProjectAction } from "@/presentation/actions/project-actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Novo Post — Admin" };

export default async function NewPostPage() {
  const [categories, posts] = await Promise.all([
    container.listCategories.execute(),
    container.listPosts.execute(),
  ]);

  const postOptions = posts.map((p) => ({ id: p.id, title: p.title }));

  return (
    <PostForm
      action={createPostAction}
      projectAction={createProjectAction}
      categories={categories}
      postOptions={postOptions}
    />
  );
}
