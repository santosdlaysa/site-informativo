import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/infrastructure/auth/auth";
import { container } from "@/infrastructure/container";
import { UsersManager } from "@/presentation/components/admin/users-manager";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Editores — Admin" };

export default async function EditoresPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/admin/login");

  const users = await container.listUsers.execute();

  return (
    <>
      <div className="page-top">
        <div>
          <h1>Editores</h1>
          <div className="sub">Gerencie quem pode acessar o painel (máx. 3)</div>
        </div>
      </div>

      <UsersManager users={users} currentUserId={session.user.id} />
    </>
  );
}
