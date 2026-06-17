import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "@/infrastructure/auth/auth";
import { container } from "@/infrastructure/container";
import { AdminSidebar } from "@/presentation/components/admin/admin-sidebar";
import { ForcePasswordChangeModal } from "@/presentation/components/admin/force-password-change-modal";
import { ToastContainer, ToastRouteListener } from "@/presentation/components/admin/toast";

/** Shell do painel: protege as rotas e injeta a navegação lateral. */
export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/admin/login");

  const security = await container.getUserSecurity.execute(session.user.id);

  return (
    <div className="app">
      <AdminSidebar />
      <main className="main">{children}</main>
      {security?.passwordChangeRequired && <ForcePasswordChangeModal />}
      <Suspense fallback={null}>
        <ToastRouteListener />
      </Suspense>
      <ToastContainer />
    </div>
  );
}
