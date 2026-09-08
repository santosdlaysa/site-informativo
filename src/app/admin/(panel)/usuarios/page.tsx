import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/infrastructure/auth/auth";
import { container } from "@/infrastructure/container";
import { normalizeUserRole } from "@/core/domain/user/user-role";
import { listCompanies } from "@/infrastructure/tenant";
import { prisma } from "@/infrastructure/database/prisma";
import { AdminUsersManager } from "@/presentation/components/admin/admin-users-manager";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Usuários — Admin" };

export default async function UsuariosPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/admin/login");
  if (normalizeUserRole(session.user.role) !== "admin") redirect("/admin/posts");

  const [users, companies, accesses] = await Promise.all([
    container.listAllUsers.execute(),
    listCompanies(),
    prisma.userCompanyAccess.findMany({ select: { userId: true, companyId: true } }),
  ]);

  const accessByUser = new Map<string, string[]>();
  for (const access of accesses) {
    accessByUser.set(access.userId, [...(accessByUser.get(access.userId) ?? []), access.companyId]);
  }
  const companyOrder = new Map(companies.map((company, index) => [company.id, index]));

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
          // Usuários criados antes dos acessos múltiplos ficam com o site padrão.
          companyIds: [...new Set([user.companyId, ...(accessByUser.get(user.id) ?? [])])]
            .sort((a, b) => (companyOrder.get(a) ?? 0) - (companyOrder.get(b) ?? 0)),
          createdAt: user.createdAt.toISOString(),
        }))}
        companies={companies.map((company) => ({ id: company.id, name: company.name, slug: company.slug, logo: company.logo }))}
        currentUserId={session.user.id}
      />
    </>
  );
}
