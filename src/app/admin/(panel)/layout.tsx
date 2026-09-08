import { redirect } from "next/navigation";
import { auth } from "@/infrastructure/auth/auth";
import { container } from "@/infrastructure/container";
import { prisma } from "@/infrastructure/database/prisma";
import { normalizeUserRole } from "@/core/domain/user/user-role";
import { AdminPanelClient } from "@/presentation/components/admin/admin-panel-client";
import { getActiveCompanyId, listAccessibleCompanies } from "@/infrastructure/tenant";

/** Shell do painel: protege as rotas e injeta a navegação lateral. */
export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/admin/login");
  const role = normalizeUserRole(session.user.role);

  const [security, user] = await Promise.all([
    container.getUserSecurity.execute(session.user.id),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        companyId: true,
        company: {
          select: { id: true, name: true, slug: true, logo: true, primaryColor: true, secondaryColor: true },
        },
      },
    }),
  ]);
  if (!user) redirect("/admin/login");

  // Cada usuário vê os sites que pode acessar; o admin vê todos.
  const companies = await listAccessibleCompanies(session.user.id, role);
  const cookieCompanyId = await getActiveCompanyId();
  const activeCompanyId = companies.some((company) => company.id === cookieCompanyId)
    ? cookieCompanyId
    : user.companyId;

  return (
    <AdminPanelClient
      role={role}
      passwordChangeRequired={security?.passwordChangeRequired ?? false}
      companies={companies}
      activeCompanyId={activeCompanyId}
    >
      {children}
    </AdminPanelClient>
  );
}
