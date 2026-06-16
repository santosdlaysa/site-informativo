"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createCalendarDateAction,
  deleteCalendarDateAction,
  type CalendarFormState,
} from "@/presentation/actions/calendar-actions";
import { TrashIcon } from "../icons";

export interface CalendarDateRowVM {
  id: string;
  title: string;
  date: string; // "dd/mm/aaaa"
}

const PAGE_SIZE = 15;
const initialState: CalendarFormState = {};

export function AdminCalendarManager({ dates }: { dates: CalendarDateRowVM[] }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(createCalendarDateAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(dates.length / PAGE_SIZE));
  const paged = dates.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      router.refresh();
    }
  }, [state, router]);

  async function handleDelete(id: string) {
    if (confirmDelete !== id) {
      setConfirmDelete(id);
      return;
    }
    setConfirmDelete(null);
    await deleteCalendarDateAction(id);
    router.refresh();
  }

  return (
    <>
      <div className="page-top">
        <div>
          <h1>Calendário Comemorativo</h1>
          <div className="sub">Cadastre datas comemorativas que aparecem na página inicial</div>
        </div>
      </div>

      <div className="panel" style={{ marginBottom: 28 }}>
        <div className="panel-head">
          <h2>Nova data comemorativa</h2>
        </div>
        <div className="panel-pad">
          {state.error && <div className="form-error">{state.error}</div>}
          <form ref={formRef} action={formAction}>
            <div className="row-2">
              <div className="field">
                <label htmlFor="title">Nome da data</label>
                <input
                  id="title"
                  name="title"
                  className="input"
                  type="text"
                  placeholder="Ex.: Dia Mundial das Doenças Raras"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="date">Data</label>
                <input
                  id="date"
                  name="date"
                  className="input"
                  type="text"
                  placeholder="dd/mm/aaaa"
                  required
                />
              </div>
            </div>
            <div className="form-actions">
              <button className="btn btn-ghost" type="reset">Limpar</button>
              <button className="btn btn-primary" type="submit" disabled={pending}>
                {pending ? "Salvando..." : "Cadastrar data"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h2>Datas cadastradas</h2>
          <span className="count">
            {dates.length} {dates.length === 1 ? "data" : "datas"}
          </span>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th>Data comemorativa</th>
              <th>Data</th>
              <th style={{ width: 72 }} />
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr className="empty-row">
                <td colSpan={3}>Nenhuma data cadastrada.</td>
              </tr>
            ) : (
              paged.map((d) => (
                <tr key={d.id}>
                  <td>{d.title}</td>
                  <td>
                    <span className="timetag">{d.date}</span>
                  </td>
                  <td className="act-cell">
                    <div className="act-inline">
                      <button
                        title={confirmDelete === d.id ? "Clique novamente para confirmar" : "Excluir"}
                        className="danger"
                        style={confirmDelete === d.id ? { background: "#fee2e2", color: "#dc2626", borderColor: "#fca5a5" } : undefined}
                        onClick={() => handleDelete(d.id)}
                      >
                        <TrashIcon width={15} height={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="tbl-pagination">
            <button
              className="btn btn-ghost"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              ← Anterior
            </button>
            <span className="tbl-page-info">
              Página {page} de {totalPages}
            </span>
            <button
              className="btn btn-ghost"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Próxima →
            </button>
          </div>
        )}
      </div>
    </>
  );
}
