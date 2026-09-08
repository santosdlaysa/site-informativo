import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/infrastructure/database/prisma";
import { getActiveCompany } from "@/infrastructure/tenant";
import { container } from "@/infrastructure/container";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Portal da Transparência",
  description: "Documentos públicos, relatórios e informações institucionais do ADSocial.",
};

export default async function TransparencyPage() {
  const company = await getActiveCompany();
  if (!company || company.slug !== "adsocial") notFound();
  const [settings, documents] = await Promise.all([
    container.getSettings.execute(),
    prisma.transparencyDocument.findMany({
      where: { companyId: company.id, published: true },
      orderBy: [{ referenceYear: "desc" }, { createdAt: "desc" }],
      select: { id: true, title: true, description: true, referenceYear: true, fileName: true, fileSize: true, mimeType: true, updatedAt: true },
    }),
  ]);

  return (
    <main className="transparency-page">
      <section className="page-hero page-hero--brand">
        <div className="wrap">
          <span className="eyebrow">Acesso à informação</span>
          <h1>{settings.transparencyTitle}</h1>
          <p>{settings.transparencyDescription}</p>
        </div>
      </section>

      <section className="wrap transparency-content">
        {documents.length === 0 ? (
          <div className="transparency-empty">
            <h2>Nenhum documento publicado</h2>
            <p>Os documentos de transparência aparecerão aqui assim que forem disponibilizados.</p>
          </div>
        ) : (
          <div className="transparency-documents">
            {documents.map((document) => (
              <article className="transparency-document" key={document.id}>
                <div className="transparency-document-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h6"/></svg>
                </div>
                <div className="transparency-document-body">
                  <div className="transparency-document-meta">
                    {document.referenceYear && <span>Ano {document.referenceYear}</span>}
                    <span>{fileLabel(document.mimeType, document.fileName)}</span>
                    <span>{formatFileSize(document.fileSize)}</span>
                  </div>
                  <h3>{document.title}</h3>
                  {document.description && <p>{document.description}</p>}
                </div>
                <a className="transparency-download" href={`/api/transparencia/${document.id}`} target="_blank" rel="noreferrer">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></svg>
                  <span>Abrir arquivo</span>
                </a>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function formatFileSize(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function fileLabel(mimeType: string, name: string) {
  if (mimeType === "application/pdf") return "PDF";
  return name.split(".").pop()?.toUpperCase() || "Arquivo";
}
