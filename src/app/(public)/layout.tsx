import "@/styles/public.css";
import { auth } from "@/infrastructure/auth/auth";
import { container } from "@/infrastructure/container";
import { SiteHeader } from "@/presentation/components/public/site-header";
import { SiteFooter } from "@/presentation/components/public/site-footer";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [session, settings] = await Promise.all([
    auth(),
    container.getSettings.execute(),
  ]);
  return (
    <>
      <SiteHeader isLoggedIn={!!session?.user?.id} />
      {children}
      <SiteFooter settings={settings} />
    </>
  );
}
