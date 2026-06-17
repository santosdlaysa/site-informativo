"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSessionAction, deleteSessionAction } from "@/presentation/actions/program-actions";
import { AdminSessionForm, type CategoryOption } from "./admin-session-form";
import { TrashIcon, EditIcon } from "../icons";
import { pushToast } from "./toast";

export interface SessionRowVM {
  id: string;
  title: string;
  speakerLine: string;
  category: string | null;
  dateTime: string;
  statusLabel: string;
  statusClass: string;
}

export function AdminProgramManager({
  sessions,
  categories,
}: {
  sessions: SessionRowVM[];
  categories: CategoryOption[];
}) {
  const router = useRouter();

  async function handleDelete(id: string) {
    if (!confirm("Excluir esta sessão?")) return;
    try {
      await deleteSessionAction(id);
      pushToast("Sessão excluída com sucesso.", "success");
      router.refresh();
    } catch {
      pushToast("Erro ao excluir a sessão.", "error");
    }
  }

  return (
    <>
      <div className="page-top">
        <div>
          <h1>Programação</h1>
          <div className="sub">Cadastre lives, workshops e sessões da agenda</div>
        </div>
      </div>

      <div className="panel" style={{ marginBottom: 28 }}>
        <div className="panel-head">
          <h2>Nova sessão</h2>
        </div>
        <div className="panel-pad">
          <AdminSessionForm action={createSessionAction} categories={categories} />
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h2>Sessões cadastradas</h2>
          <span className="count">
            {sessions.length} {sessions.length === 1 ? "sessão" : "sessões"}
          </span>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th>Sessão</th>
              <th>Categoria</th>
              <th>Data / Hora</th>
              <th>Status</th>
              <th style={{ width: 96 }} />
            </tr>
          </thead>
          <tbody>
            {sessions.length === 0 ? (
              <tr className="empty-row">
                <td colSpan={5}>Nenhuma sessão cadastrada.</td>
              </tr>
            ) : (
              sessions.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div className="t-title">
                      {s.title}
                      <div className="t-sub">{s.speakerLine}</div>
                    </div>
                  </td>
                  <td>{s.category ? <span className="pill pill-blue">{s.category}</span> : "—"}</td>
                  <td>{s.dateTime}</td>
                  <td>
                    <span className={`pill ${s.statusClass}`}>{s.statusLabel}</span>
                  </td>
                  <td className="act-cell">
                    <div className="act-inline">
                      <Link
                        href={`/admin/programacao/${s.id}/editar`}
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
                      <button title="Excluir" className="danger" onClick={() => handleDelete(s.id)}>
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
    </>
  );
}
