import "@/styles/public.css";
import { auth } from "@/infrastructure/auth/auth";
import { SiteHeader } from "@/presentation/components/public/site-header";
import { SiteFooter } from "@/presentation/components/public/site-footer";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <>
      <SiteHeader isLoggedIn={!!session?.user?.id} />
      {children}
      <SiteFooter />
    </>
  );
}
