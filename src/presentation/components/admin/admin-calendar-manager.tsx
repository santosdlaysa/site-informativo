"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createCalendarDateAction,
  deleteCalendarDateAction,
  type CalendarFormState,
} from "@/presentation/actions/calendar-actions";
import { TrashIcon } from "../icons";
import { pushToast } from "./toast";

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
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? dates.filter(
        (d) =>
          d.title.toLowerCase().includes(search.toLowerCase()) ||
          d.date.includes(search),
      )
    : dates;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      pushToast("Data cadastrada com sucesso!", "success");
      router.refresh();
    }
    if (state.error) {
      pushToast(state.error, "error");
    }
  }, [state, router]);

  async function handleDelete(id: string) {
    if (!confirm("Excluir esta data comemorativa?")) return;
    try {
      await deleteCalendarDateAction(id);
      pushToast("Data excluída com sucesso!", "success");
      router.refresh();
    } catch {
      pushToast("Erro ao excluir a data.", "error");
    }
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
            {filtered.length} {filtered.length === 1 ? "data" : "datas"}
          </span>
        </div>
        <div style={{ padding: "12px 24px", borderBottom: "1px solid var(--line)" }}>
          <input
            className="input"
            type="search"
            placeholder="Buscar por nome ou data (ex: 16/06/2026)…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
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
                <td colSpan={3}>{search ? "Nenhum resultado para a busca." : "Nenhuma data cadastrada."}</td>
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
                        title="Excluir"
                        className="danger"
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
              disabled={safePage === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              ← Anterior
            </button>
            <span className="tbl-page-info">
              Página {safePage} de {totalPages}
            </span>
            <button
              className="btn btn-ghost"
              disabled={safePage === totalPages}
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
