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
  color: string;
  description: string | null;
}

const COLOR_OPTIONS = [
  { value: "purple", label: "Roxo" },
  { value: "blue", label: "Azul" },
  { value: "green", label: "Verde" },
  { value: "red", label: "Vermelho" },
  { value: "orange", label: "Laranja" },
  { value: "turquoise", label: "Turquesa" },
];

const COLOR_DOT: Record<string, string> = {
  purple: "#703cc0",
  blue: "#267ce8",
  green: "#22c55e",
  red: "#ef4444",
  orange: "#ea580c",
  turquoise: "#00c2d1",
};

const initialState: CalendarFormState = {};

export function AdminCalendarManager({ dates }: { dates: CalendarDateRowVM[] }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(createCalendarDateAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

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
            <div className="form-grid">
              <div className="stack">
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
                  <label htmlFor="description">Descrição (opcional)</label>
                  <textarea
                    id="description"
                    name="description"
                    className="textarea"
                    placeholder="Contexto ou informações adicionais sobre a data"
                    rows={3}
                  />
                </div>
              </div>
              <div className="stack">
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
                <div className="field">
                  <label htmlFor="color">Cor</label>
                  <div className="selnative">
                    <select id="color" name="color" className="select" defaultValue="purple">
                      {COLOR_OPTIONS.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                    <svg className="chev" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                </div>
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
              <th>Cor</th>
              <th style={{ width: 72 }} />
            </tr>
          </thead>
          <tbody>
            {dates.length === 0 ? (
              <tr className="empty-row">
                <td colSpan={4}>Nenhuma data cadastrada.</td>
              </tr>
            ) : (
              dates.map((d) => (
                <tr key={d.id}>
                  <td>
                    <div className="t-title">
                      {d.title}
                      {d.description && <div className="t-sub">{d.description}</div>}
                    </div>
                  </td>
                  <td>
                    <span className="timetag">{d.date}</span>
                  </td>
                  <td>
                    <span
                      style={{
                        display: "inline-block",
                        width: 14,
                        height: 14,
                        borderRadius: "50%",
                        background: COLOR_DOT[d.color] ?? "#703cc0",
                        verticalAlign: "middle",
                        marginRight: 6,
                      }}
                    />
                    {COLOR_OPTIONS.find((c) => c.value === d.color)?.label ?? d.color}
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
      </div>
    </>
  );
}
