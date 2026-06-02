import Link from "next/link";
import type { Metadata } from "next";
import { container } from "@/infrastructure/container";
import { AdminPostsTable } from "@/presentation/components/admin/admin-posts-table";
import { PlusIcon } from "@/presentation/components/icons";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Posts — Admin" };

export default async function AdminPostsPage() {
  const posts = await container.listPosts.execute();

  return (
    <>
      <div className="page-top">
        <div>
          <h1>Posts</h1>
          <div className="sub">
            {posts.length} {posts.length === 1 ? "post" : "posts"} no total · gerencie e edite suas
            publicações
          </div>
        </div>
        <Link className="btn btn-primary" href="/admin/posts/novo">
          <PlusIcon /> Novo Post
        </Link>
      </div>

      <AdminPostsTable posts={posts} />
    </>
  );
}
