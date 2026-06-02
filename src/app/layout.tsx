import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "MeuBlog",
    template: "%s — MeuBlog",
  },
  description:
    "Conteúdo sobre desenvolvimento web, tecnologia e bem-estar. Posts, programação e eventos.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
