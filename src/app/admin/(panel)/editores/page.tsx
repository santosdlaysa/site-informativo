import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/infrastructure/auth/auth";
import { container } from "@/infrastructure/container";
import { normalizeUserRole } from "@/core/domain/user/user-role";
import { UsersManager } from "@/presentation/components/admin/users-manager";
import { getActiveCompanyId } from "@/infrastructure/tenant";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Editores — Admin" };

export default async function EditoresPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/admin/login");

  const role = normalizeUserRole(session.user.role);
  const companyId = role === "admin" ? await getActiveCompanyId() : session.user.companyId;
  if (!companyId) redirect("/admin/login");
  const [users, profile] = await Promise.all([
    container.listUsers.execute(companyId),
    container.getProfile.execute(session.user.id),
  ]);

  return (
    <>
      <div className="page-top">
        <div>
          <h1>Editores</h1>
          <div className="sub">{role === "admin" ? "Gerencie quem pode acessar o painel (máx. 3)" : "Veja quem está no painel"}</div>
        </div>
      </div>

      <UsersManager users={users} currentUserId={session.user.id} currentProfile={profile} currentUserRole={role} />
    </>
  );
}
