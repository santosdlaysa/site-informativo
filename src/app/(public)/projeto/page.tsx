import type { Metadata } from "next";
import { container } from "@/infrastructure/container";
import { QsPartners } from "@/presentation/components/public/qs-partners";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "O Projeto" };

export default async function ProjetoPage() {
  const settings = await container.getSettings.execute();

  const paragraphs = (settings.qsFullText ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="wrap">
      <article className="projeto-page">
        <span className="qs-tag">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={14} height={14}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          {settings.qsTag}
        </span>
        <h1 className="projeto-title">{settings.qsTitle}</h1>

        <div className="projeto-body">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <QsPartners settings={settings} />
      </article>
    </div>
  );
}
