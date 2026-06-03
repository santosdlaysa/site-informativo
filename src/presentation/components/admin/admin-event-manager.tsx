"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createEventAction, deleteEventAction } from "@/presentation/actions/event-actions";
import { AdminEventForm } from "./admin-event-form";
import type { CategoryOption } from "./admin-session-form";
import { TrashIcon, EditIcon } from "../icons";

export interface EventRowVM {
  id: string;
  title: string;
  location: string | null;
  formatLabel: string;
  online: boolean;
  date: string;
}

export function AdminEventManager({
  events,
  categories,
}: {
  events: EventRowVM[];
  categories: CategoryOption[];
}) {
  const router = useRouter();

  async function handleDelete(id: string) {
    if (!confirm("Excluir este evento?")) return;
    await deleteEventAction(id);
    router.refresh();
  }

  return (
    <>
      <div className="page-top">
        <div>
          <h1>Eventos</h1>
          <div className="sub">Cadastre encontros, workshops e meetups da comunidade</div>
        </div>
      </div>

      <div className="panel" style={{ marginBottom: 28 }}>
        <div className="panel-head">
          <h2>Novo evento</h2>
        </div>
        <div className="panel-pad">
          <AdminEventForm action={createEventAction} categories={categories} />
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h2>Eventos cadastrados</h2>
          <span className="count">
            {events.length} {events.length === 1 ? "evento" : "eventos"}
          </span>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th>Evento</th>
              <th>Formato</th>
              <th>Data</th>
              <th>Local</th>
              <th style={{ width: 96 }} />
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr className="empty-row">
                <td colSpan={5}>Nenhum evento cadastrado.</td>
              </tr>
            ) : (
              events.map((ev) => (
                <tr key={ev.id}>
                  <td>
                    <div className="t-title">
                      {ev.title}
                      <div className="t-sub">{ev.location ?? "Local a definir"}</div>
                    </div>
                  </td>
                  <td>
                    {ev.online ? (
                      <span style={{ color: "var(--green)", fontWeight: 600 }}>Online</span>
                    ) : (
                      ev.formatLabel
                    )}
                  </td>
                  <td>
                    <span className="timetag">{ev.date}</span>
                  </td>
                  <td>{ev.location ?? "—"}</td>
                  <td className="act-cell">
                    <div className="act-inline">
                      <Link
                        href={`/admin/eventos/${ev.id}/editar`}
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
                      <button title="Excluir" className="danger" onClick={() => handleDelete(ev.id)}>
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
