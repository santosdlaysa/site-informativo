import { redirect } from "next/navigation";
import { auth } from "@/infrastructure/auth/auth";
import { AdminSidebar } from "@/presentation/components/admin/admin-sidebar";

/** Shell do painel: protege as rotas e injeta a navegação lateral. */
export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  return (
    <div className="app">
      <AdminSidebar />
      <main className="main">{children}</main>
    </div>
  );
}
