import Link from "next/link";
import type { Metadata } from "next";
import { container } from "@/infrastructure/container";
import { ImageSlot } from "@/presentation/components/image-slot";
import { EditIcon, EyeIcon, PlusIcon } from "@/presentation/components/icons";
import { PostStatus } from "@/core/domain/post/post-status";
import { formatShortDate } from "@/presentation/lib/format";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Projetos — Admin" };

export default async function AdminProjetosPage() {
  const projects = await container.projectRepository.listOwners();

  return (
    <>
      <div className="page-top">
        <div>
          <h1>Projetos</h1>
          <div className="sub">
            {projects.length} {projects.length === 1 ? "projeto" : "projetos"} · posts que possuem
            uma galeria de projeto
          </div>
        </div>
        <Link className="btn btn-primary" href="/admin/posts/novo">
          <PlusIcon /> Novo Post
        </Link>
      </div>

      <div className="panel">
        <table className="tbl">
          <thead>
            <tr>
              <th>Projeto</th>
              <th>Itens</th>
              <th>Status</th>
              <th>Atualizado</th>
              <th style={{ width: 96 }} />
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr className="empty-row">
                <td colSpan={5}>
                  Nenhum post com galeria de projeto ainda. Edite um post e adicione itens na seção
                  de projeto.
                </td>
              </tr>
            ) : (
              projects.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <span className="thumb" style={{ position: "relative" }}>
                        <ImageSlot src={p.coverImage} placeholder="" rounded={false} />
                      </span>
                      <div className="t-title">{p.title}</div>
                    </div>
                  </td>
                  <td>
                    {p.itemCount} {p.itemCount === 1 ? "item" : "itens"}
                  </td>
                  <td>
                    {p.status === PostStatus.Published ? (
                      <span className="pill pill-pub">Publicado</span>
                    ) : (
                      <span className="pill pill-draft">Rascunho</span>
                    )}
                  </td>
                  <td>{formatShortDate(p.updatedAt)}</td>
                  <td className="act-cell">
                    <div
                      className="act-inline"
                      style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end" }}
                    >
                      <Link
                        href={`/admin/posts/${p.id}/editar`}
                        title="Editar"
                        style={{
                          width: 34,
                          height: 34,
                          border: "1px solid var(--line)",
                          background: "#fff",
                          borderRadius: 8,
                          color: "var(--muted)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <EditIcon width={16} height={16} />
                      </Link>
                      <a
                        href={`/posts/${p.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        title="Visualizar"
                        style={{
                          width: 34,
                          height: 34,
                          border: "1px solid var(--line)",
                          background: "#fff",
                          borderRadius: 8,
                          color: "var(--muted)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <EyeIcon width={16} height={16} />
                      </a>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
