"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { PostListItem } from "@/core/domain/post/post.repository";
import { PostStatus } from "@/core/domain/post/post-status";
import { ImageSlot } from "../image-slot";
import { EditIcon, EyeIcon, TrashIcon, SearchIcon } from "../icons";
import { formatShortDate } from "@/presentation/lib/format";
import { deletePostAction } from "@/presentation/actions/post-actions";
import { pushToast } from "./toast";

type Tab = "todos" | "pub" | "rasc";

export function AdminPostsTable({ posts, currentUserId }: { posts: PostListItem[]; currentUserId: string }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("todos");
  const [query, setQuery] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const byTab =
        tab === "todos" ||
        (tab === "pub" && p.status === PostStatus.Published) ||
        (tab === "rasc" && p.status === PostStatus.Draft);
      const byQuery = p.title.toLowerCase().includes(query.trim().toLowerCase());
      return byTab && byQuery;
    });
  }, [posts, tab, query]);

  function handleDelete(id: string) {
    if (!confirm("Excluir este post?")) return;
    setOpenMenu(null);
    startTransition(async () => {
      try {
        await deletePostAction(id);
        pushToast("Post excluído com sucesso.", "success");
        router.refresh();
      } catch {
        pushToast("Erro ao excluir o post.", "error");
      }
    });
  }

  return (
    <div className="panel" onClick={() => setOpenMenu(null)}>
      <div className="toolbar-row">
        <div className="tabs" style={{ padding: 0, border: "none", margin: 0 }}>
          {(
            [
              ["todos", "Todos"],
              ["pub", "Publicados"],
              ["rasc", "Rascunhos"],
            ] as const
          ).map(([key, label]) => (
            <div
              key={key}
              className={`tab${tab === key ? " active" : ""}`}
              onClick={() => setTab(key)}
            >
              {label}
            </div>
          ))}
        </div>
        <div className="search">
          <SearchIcon />
          <input
            type="text"
            placeholder="Buscar posts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>
      <div style={{ borderTop: "1px solid var(--line)", marginTop: 16 }} />

      <table className="tbl">
        <thead>
          <tr>
            <th>Título</th>
            <th>Menu</th>
            <th>Status</th>
            <th>Data</th>
            <th style={{ width: 56 }} />
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr className="empty-row">
              <td colSpan={5}>Nenhum post encontrado.</td>
            </tr>
          ) : (
            filtered.map((p) => (
              <tr key={p.id} style={{ opacity: pending ? 0.6 : 1 }}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <span className="thumb" style={{ position: "relative" }}>
                      <ImageSlot src={p.coverImage} placeholder="" rounded={false} />
                    </span>
                    <div className="t-title">
                      {p.title}
                      <div className="t-sub">por {p.authorName}</div>
                    </div>
                  </div>
                </td>
                <td>{p.category?.name ?? "—"}</td>
                <td>
                  {p.status === PostStatus.Published ? (
                    <span className="pill pill-pub">Publicado</span>
                  ) : (
                    <span className="pill pill-draft">Rascunho</span>
                  )}
                </td>
                <td>{formatShortDate(p.publishedAt ?? p.createdAt)}</td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end" }}>
                    {p.authorId === currentUserId && (
                      <Link
                        className="act-edit"
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
                    )}
                    <div className="kebab" onClick={(e) => e.stopPropagation()}>
                      <button
                        className="kebab-btn"
                        onClick={() => setOpenMenu((cur) => (cur === p.id ? null : p.id))}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="5" r="1.4" />
                          <circle cx="12" cy="12" r="1.4" />
                          <circle cx="12" cy="19" r="1.4" />
                        </svg>
                      </button>
                      <div className={`kebab-menu${openMenu === p.id ? " open" : ""}`}>
                        {p.authorId === currentUserId && (
                          <Link href={`/admin/posts/${p.id}/editar`} style={{ textDecoration: "none" }}>
                            <button>
                              <EditIcon /> Editar
                            </button>
                          </Link>
                        )}
                        <a href={`/posts/${p.slug}`} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                          <button>
                            <EyeIcon /> Visualizar
                          </button>
                        </a>
                        {p.authorId === currentUserId && (
                          <button className="danger" onClick={() => handleDelete(p.id)}>
                            <TrashIcon /> Excluir
                          </button>
                        )}
                      </div>
                    </div>
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
