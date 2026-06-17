import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/infrastructure/auth/auth";
import { container } from "@/infrastructure/container";
import { normalizeUserRole } from "@/core/domain/user/user-role";
import { PostForm } from "@/presentation/components/admin/post-form";
import { createPostAction } from "@/presentation/actions/post-actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Novo Post — Admin" };

export default async function NewPostPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/admin/login");
  if (normalizeUserRole(session.user.role) === "viewer") redirect("/admin/posts");

  const [categories, posts] = await Promise.all([
    container.listCategories.execute(),
    container.listPosts.execute(),
  ]);

  const postOptions = posts.map((p) => ({ id: p.id, title: p.title }));

  return (
    <PostForm
      action={createPostAction}
      categories={categories}
      postOptions={postOptions}
    />
  );
}
