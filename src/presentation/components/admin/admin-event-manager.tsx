"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { EventFormat, EVENT_FORMAT_LABEL } from "@/core/domain/event/event-format";
import {
  createEventAction,
  deleteEventAction,
  type EventFormState,
} from "@/presentation/actions/event-actions";
import { ImageSlot } from "../image-slot";
import { TrashIcon, PlusIcon } from "../icons";

export interface EventRowVM {
  id: string;
  title: string;
  location: string | null;
  formatLabel: string;
  online: boolean;
  date: string;
}

const initial: EventFormState = {};

export function AdminEventManager({
  events,
  categories,
}: {
  events: EventRowVM[];
  categories: string[];
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(createEventAction, initial);
  const [cover, setCover] = useState("");
  const [resetKey, setResetKey] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      setCover("");
      setResetKey((k) => k + 1);
      router.refresh();
    }
  }, [state, router]);

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
          {state.error && <div className="form-error">{state.error}</div>}
          <form ref={formRef} action={formAction}>
            <div className="form-grid">
              <div className="stack">
                <div className="field">
                  <label htmlFor="title">Nome do evento</label>
                  <input id="title" name="title" className="input" type="text" placeholder="Ex.: MeuBlog Conf 2024" required />
                </div>
                <div className="field">
                  <label htmlFor="description">Descrição</label>
                  <textarea id="description" name="description" className="textarea" placeholder="Sobre o evento, palestras e atrações" />
                </div>
                <div className="row-2">
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
                  <div className="field">
                    <label htmlFor="format">Formato</label>
                    <div className="selnative">
                      <select id="format" name="format" className="select" defaultValue={EventFormat.Presential}>
                        {Object.values(EventFormat).map((f) => (
                          <option key={f} value={f}>
                            {EVENT_FORMAT_LABEL[f]}
                          </option>
                        ))}
                      </select>
                      <Chevron />
                    </div>
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="location">Local / endereço</label>
                  <input id="location" name="location" className="input" type="text" placeholder="Ex.: Centro de Convenções · São Paulo, SP" />
                </div>
              </div>

              <div className="stack">
                <div className="field">
                  <span className="lbl">Imagem de capa</span>
                  <div className="dropzone" style={{ position: "relative", height: 150, padding: 0, overflow: "hidden" }}>
                    <ImageSlot
                      key={resetKey}
                      src={cover || null}
                      placeholder="Clique para enviar uma imagem ou arraste e solte"
                      editable
                      onChange={setCover}
                    />
                  </div>
                  <input type="hidden" name="coverImage" value={cover} />
                </div>
                <div className="row-2">
                  <div className="field">
                    <label htmlFor="date">Data</label>
                    <input id="date" name="date" className="input" type="text" placeholder="dd/mm/aaaa" required />
                  </div>
                  <div className="field">
                    <label htmlFor="time">Horário</label>
                    <input id="time" name="time" className="input" type="text" placeholder="hh:mm" defaultValue="09:00" />
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="capacity">Capacidade (vagas)</label>
                  <input id="capacity" name="capacity" className="input" type="text" placeholder="Ex.: 350" />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button className="btn btn-ghost" type="reset">
                Limpar
              </button>
              <button className="btn btn-primary" type="submit" disabled={pending}>
                <PlusIcon /> {pending ? "Cadastrando..." : "Cadastrar evento"}
              </button>
            </div>
          </form>
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

function Chevron() {
  return (
    <svg className="chev" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
