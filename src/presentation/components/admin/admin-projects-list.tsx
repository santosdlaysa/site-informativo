"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { PostListItem } from "@/core/domain/post/post.repository";
import { PostStatus } from "@/core/domain/post/post-status";
import { EditIcon, TrashIcon } from "../icons";
import { formatShortDate } from "@/presentation/lib/format";
import { deleteProjectAction } from "@/presentation/actions/project-actions";

export function AdminProjectsList({ projects }: { projects: PostListItem[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleDelete(id: string) {
    if (!confirm("Excluir esta coleção?")) return;
    startTransition(async () => {
      await deleteProjectAction(id);
      router.refresh();
    });
  }

  return (
    <div className="panel">
      <div className="panel-head">
        <h2>Coleções</h2>
        <span className="count">
          {projects.length} {projects.length === 1 ? "coleção" : "coleções"}
        </span>
      </div>
      <table className="tbl">
        <thead>
          <tr>
            <th>Coleção</th>
            <th>Status</th>
            <th>Data</th>
            <th style={{ width: 96 }} />
          </tr>
        </thead>
        <tbody>
          {projects.length === 0 ? (
            <tr className="empty-row">
              <td colSpan={4}>Nenhuma coleção criada ainda.</td>
            </tr>
          ) : (
            projects.map((p) => (
              <tr key={p.id} style={{ opacity: pending ? 0.6 : 1 }}>
                <td>
                  <div className="t-title">
                    {p.title}
                    <div className="t-sub">por {p.authorName}</div>
                  </div>
                </td>
                <td>
                  {p.status === PostStatus.Published ? (
                    <span className="pill pill-pub">Publicado</span>
                  ) : (
                    <span className="pill pill-draft">Rascunho</span>
                  )}
                </td>
                <td>{formatShortDate(p.publishedAt ?? p.createdAt)}</td>
                <td className="act-cell">
                  <div className="act-inline">
                    <Link
                      href={`/admin/projetos/${p.id}/editar`}
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
                    <button className="danger" title="Excluir" onClick={() => handleDelete(p.id)}>
                      <TrashIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
