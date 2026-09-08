import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  // Metadados neutros da plataforma: cada site público aplica seu próprio nome e
  // template no layout interno, e o painel faz o mesmo em /admin.
  title: "Movie",
  description:
    "Plataforma Movie para gestão dos sites institucionais: posts, eventos, projetos, programação e transparência.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={poppins.variable}>
      <body>{children}</body>
    </html>
  );
}
