import type { Metadata } from "next";
import "@/styles/admin.css";
import { ADMIN_DOMAIN } from "@/infrastructure/site-domains";

const ADMIN_TITLE = "Movie — Painel Administrativo";
const ADMIN_DESCRIPTION =
  "Painel administrativo da plataforma Movie: gerencie posts, eventos, projetos, programação, transparência e usuários dos sites institucionais.";

/** Metadados próprios do painel: sem eles o /admin herdaria o título e a
 *  descrição definidos no layout raiz. */
export const metadata: Metadata = {
  metadataBase: new URL(`https://${ADMIN_DOMAIN}`),
  title: {
    default: ADMIN_TITLE,
    template: "%s — Movie",
  },
  description: ADMIN_DESCRIPTION,
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    siteName: "Movie",
    title: ADMIN_TITLE,
    description: ADMIN_DESCRIPTION,
    url: "/admin",
    images: [{ url: "/movie-sidebar-logo.png", alt: "Movie" }],
  },
  twitter: {
    card: "summary",
    title: ADMIN_TITLE,
    description: ADMIN_DESCRIPTION,
    images: ["/movie-sidebar-logo.png"],
  },
};

/** Layout raiz do /admin: carrega o sistema visual do painel.
 *  O shell com sidebar e o guard de sessão ficam no grupo (panel). */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
