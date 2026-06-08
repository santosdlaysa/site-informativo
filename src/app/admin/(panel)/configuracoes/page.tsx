import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/infrastructure/auth/auth";
import { container } from "@/infrastructure/container";
import { ProfileForm } from "@/presentation/components/admin/profile-form";
import { HeroSettingsForm } from "@/presentation/components/admin/hero-settings-form";
import { QuemSomosSettingsForm } from "@/presentation/components/admin/quem-somos-settings-form";
import { SocialSettingsForm } from "@/presentation/components/admin/social-settings-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Configurações — Admin" };

export default async function AdminSettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/admin/login");

  const [profile, settings] = await Promise.all([
    container.getProfile.execute(session.user.id),
    container.getSettings.execute(),
  ]);

  return (
    <>
      <div className="page-top">
        <div>
          <h1>Configurações</h1>
          <div className="sub">Perfil do autor e textos da página inicial</div>
        </div>
      </div>

      <ProfileForm profile={profile} />

      <div style={{ marginTop: 32 }}>
        <HeroSettingsForm settings={settings} />
      </div>

      <div style={{ marginTop: 32 }}>
        <QuemSomosSettingsForm settings={settings} />
      </div>

      <div style={{ marginTop: 32 }}>
        <SocialSettingsForm settings={settings} />
      </div>
    </>
  );
}
