import "@/styles/public.css";
import { auth } from "@/infrastructure/auth/auth";
import { container } from "@/infrastructure/container";
import { SiteHeader } from "@/presentation/components/public/site-header";
import { SiteFooter } from "@/presentation/components/public/site-footer";
import { CompanyPathProvider } from "@/presentation/components/public/company-link";
import { getActiveCompany } from "@/infrastructure/tenant";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const company = await getActiveCompany();
  const name = company?.name || "Raros Boa Vista";
  const isAdsocial = company?.slug === "adsocial";

  return {
    title: {
      default: name,
      template: `%s — ${name}`,
    },
    description: isAdsocial
      ? "O ADSocial promove assistência social, educação, cultura, saúde, inclusão e desenvolvimento para transformar comunidades."
      : "O Centro Social Raros Boa Vista promove capacitação, inclusão e desenvolvimento, fortalecendo vínculos e redes de apoio.",
    icons: company?.logo ? { icon: company.logo } : undefined,
  };
}

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [session, settings, company] = await Promise.all([
    auth(),
    container.getSettings.execute(),
    getActiveCompany(),
  ]);
  return (
    <CompanyPathProvider slug={company?.slug || "raros-boa-vista"}>
      <div className={`company-public-theme company-public-theme--${company?.slug || "raros-boa-vista"}`} style={{
        "--company-primary": company?.primaryColor || "#703cc0",
        "--company-secondary": company?.secondaryColor || "#267ce8",
      } as React.CSSProperties}>
        <SiteHeader isLoggedIn={!!session?.user?.id} company={company} />
        {children}
        <SiteFooter settings={settings} company={company} />
      </div>
    </CompanyPathProvider>
  );
}
