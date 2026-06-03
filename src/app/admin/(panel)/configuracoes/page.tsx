import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/infrastructure/auth/auth";
import { container } from "@/infrastructure/container";
import { ProfileForm } from "@/presentation/components/admin/profile-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Configurações — Admin" };

export default async function AdminSettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/admin/login");

  const profile = await container.getProfile.execute(session.user.id);

  return (
    <>
      <div className="page-top">
        <div>
          <h1>Configurações</h1>
          <div className="sub">Edite o nome e a bio do autor exibidos nos posts</div>
        </div>
      </div>

      <ProfileForm profile={profile} />
    </>
  );
}
