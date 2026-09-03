import { redirect } from "next/navigation";
import { auth } from "@/infrastructure/auth/auth";
import { container } from "@/infrastructure/container";
import { normalizeUserRole } from "@/core/domain/user/user-role";
import { AdminSidebar } from "@/presentation/components/admin/admin-sidebar";
import { ForcePasswordChangeModal } from "@/presentation/components/admin/force-password-change-modal";
import { AdminPanelClient } from "@/presentation/components/admin/admin-panel-client";
import { CompanySwitcher } from "@/presentation/components/admin/company-switcher";
import { getActiveCompanyId, listCompanies } from "@/infrastructure/tenant";

/** Shell do painel: protege as rotas e injeta a navegação lateral. */
export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/admin/login");
  const role = normalizeUserRole(session.user.role);

  const security = await container.getUserSecurity.execute(session.user.id);
  const [companies, activeCompanyId] = await Promise.all([listCompanies(), getActiveCompanyId()]);

  return (
    <AdminPanelClient
      role={role}
      passwordChangeRequired={security?.passwordChangeRequired ?? false}
      companySwitcher={<CompanySwitcher companies={companies} activeCompanyId={activeCompanyId} />}
    >
      {children}
    </AdminPanelClient>
  );
}
