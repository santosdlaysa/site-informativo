"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { SessionStatus, SESSION_STATUS_LABEL } from "@/core/domain/program/session-status";
import {
  createSessionAction,
  deleteSessionAction,
  type SessionFormState,
} from "@/presentation/actions/program-actions";
import { TrashIcon, PlusIcon } from "../icons";

export interface SessionRowVM {
  id: string;
  title: string;
  speakerLine: string;
  category: string | null;
  dateTime: string;
  statusLabel: string;
  statusClass: string;
}

const initial: SessionFormState = {};

export function AdminProgramManager({
  sessions,
  categories,
}: {
  sessions: SessionRowVM[];
  categories: string[];
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(createSessionAction, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      router.refresh();
    }
  }, [state, router]);

  async function handleDelete(id: string) {
    if (!confirm("Excluir esta sessão?")) return;
    await deleteSessionAction(id);
    router.refresh();
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
          {state.error && <div className="form-error">{state.error}</div>}
          <form ref={formRef} action={formAction}>
            <div className="form-grid">
              <div className="stack">
                <div className="field">
                  <label htmlFor="title">Título da sessão</label>
                  <input id="title" name="title" className="input" type="text" placeholder="Ex.: Prisma + PostgreSQL na prática" required />
                </div>
                <div className="field">
                  <label htmlFor="description">Descrição</label>
                  <textarea id="description" name="description" className="textarea" placeholder="Resumo do que será abordado na sessão" />
                </div>
                <div className="row-2">
                  <div className="field">
                    <label htmlFor="speaker">Palestrante</label>
                    <input id="speaker" name="speaker" className="input" type="text" placeholder="Nome do palestrante" />
                  </div>
                  <div className="field">
                    <label htmlFor="speakerRole">Cargo / função</label>
                    <input id="speakerRole" name="speakerRole" className="input" type="text" placeholder="Ex.: Engenheira de Software" />
                  </div>
                </div>
              </div>

              <div className="stack">
                <div className="field">
                  <label htmlFor="category">Categoria</label>
                  <div className="selnative">
                    <select id="category" name="category" className="select">
                      <option value="">Selecione</option>
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <Chevron />
                  </div>
                </div>
                <div className="row-2">
                  <div className="field">
                    <label htmlFor="date">Data</label>
                    <input id="date" name="date" className="input" type="text" placeholder="dd/mm/aaaa" defaultValue="" required />
                  </div>
                  <div className="field">
                    <label htmlFor="time">Horário</label>
                    <input id="time" name="time" className="input" type="text" placeholder="hh:mm" defaultValue="10:00" />
                  </div>
                </div>
                <div className="row-2">
                  <div className="field">
                    <label htmlFor="durationMin">Duração (min)</label>
                    <input id="durationMin" name="durationMin" className="input" type="text" defaultValue="60" />
                  </div>
                  <div className="field">
                    <label htmlFor="status">Status</label>
                    <div className="selnative">
                      <select id="status" name="status" className="select" defaultValue={SessionStatus.Scheduled}>
                        {Object.values(SessionStatus).map((s) => (
                          <option key={s} value={s}>
                            {SESSION_STATUS_LABEL[s]}
                          </option>
                        ))}
                      </select>
                      <Chevron />
                    </div>
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="link">Link da transmissão</label>
                  <input id="link" name="link" className="input" type="text" placeholder="https://..." />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button className="btn btn-ghost" type="reset">
                Limpar
              </button>
              <button className="btn btn-primary" type="submit" disabled={pending}>
                <PlusIcon /> {pending ? "Cadastrando..." : "Cadastrar sessão"}
              </button>
            </div>
          </form>
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

function Chevron() {
  return (
    <svg className="chev" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
