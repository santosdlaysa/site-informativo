import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/infrastructure/auth/auth";
import { container } from "@/infrastructure/container";
import { normalizeUserRole } from "@/core/domain/user/user-role";
import { AdminPostsTable } from "@/presentation/components/admin/admin-posts-table";
import { PlusIcon, EyeIcon } from "@/presentation/components/icons";
import { getActiveCompany } from "@/infrastructure/tenant";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Posts — Admin" };

export default async function AdminPostsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/admin/login");
  const role = normalizeUserRole(session.user.role);

  const [posts, activeCompany] = await Promise.all([
    container.listPosts.execute(),
    getActiveCompany(),
  ]);

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
        <div style={{ display: "flex", gap: 10 }}>
          <Link className="btn btn-ghost" href={`/admin/preview?company=${encodeURIComponent(activeCompany?.slug || "raros-boa-vista")}`} target="_blank" rel="noopener noreferrer">
            <EyeIcon /> Visualizar site
          </Link>
          {role !== "viewer" && (
            <Link className="btn btn-primary" href="/admin/posts/novo">
              <PlusIcon /> Novo Post
            </Link>
          )}
        </div>
      </div>

      <AdminPostsTable posts={posts} currentUserId={session.user.id} currentUserRole={role} />
    </>
  );
}
