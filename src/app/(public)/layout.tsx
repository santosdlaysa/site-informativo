import "@/styles/public.css";
import { SiteHeader } from "@/presentation/components/public/site-header";
import { SiteFooter } from "@/presentation/components/public/site-footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
