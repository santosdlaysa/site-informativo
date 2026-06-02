import type { Metadata } from "next";
import { container } from "@/infrastructure/container";
import { PostForm } from "@/presentation/components/admin/post-form";
import { createPostAction } from "@/presentation/actions/post-actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Novo Post — Admin" };

export default async function NewPostPage() {
  const categories = await container.listCategories.execute();
  return <PostForm action={createPostAction} categories={categories} />;
}
