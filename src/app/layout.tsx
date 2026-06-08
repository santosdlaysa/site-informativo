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
  title: {
    default: "Raros Boa Vista",
    template: "%s — Raros Boa Vista",
  },
  description:
    "O Centro Social Raros Boa Vista promove capacitação, inclusão digital e desenvolvimento artístico de crianças, adolescentes e jovens em Roraima, fortalecendo vínculos e gerando redes de apoio para a comunidade.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={poppins.variable}>
      <body>{children}</body>
    </html>
  );
}
