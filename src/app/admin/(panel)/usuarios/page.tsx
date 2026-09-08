import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/infrastructure/auth/auth";
import { container } from "@/infrastructure/container";
import { normalizeUserRole } from "@/core/domain/user/user-role";
import { listCompanies } from "@/infrastructure/tenant";
import { AdminUsersManager } from "@/presentation/components/admin/admin-users-manager";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Usuários — Admin" };

export default async function UsuariosPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/admin/login");
  if (normalizeUserRole(session.user.role) !== "admin") redirect("/admin/posts");

  const [users, companies] = await Promise.all([
    container.listAllUsers.execute(),
    listCompanies(),
  ]);

  return (
    <>
      <div className="page-top">
        <div>
          <h1>Usuários</h1>
          <div className="sub">Cadastre os acessos e defina em qual site cada pessoa entra</div>
        </div>
      </div>

      <AdminUsersManager
        users={users.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          companyId: user.companyId,
          createdAt: user.createdAt.toISOString(),
        }))}
        companies={companies.map((company) => ({ id: company.id, name: company.name, slug: company.slug, logo: company.logo }))}
        currentUserId={session.user.id}
      />
    </>
  );
}
