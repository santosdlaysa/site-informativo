"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { EventFormat, EVENT_FORMAT_LABEL } from "@/core/domain/event/event-format";
import type { EventFormState } from "@/presentation/actions/event-actions";
import { ImageSlot } from "../image-slot";
import type { CategoryOption } from "./admin-session-form";
import { pushToast } from "./toast";

export interface EventFormInitial {
  title?: string;
  description?: string;
  categoryId?: string | null;
  format?: EventFormat;
  location?: string;
  coverImage?: string | null;
  date?: string;
  time?: string;
  capacity?: string;
}

type Action = (prev: EventFormState, formData: FormData) => Promise<EventFormState>;

const initialState: EventFormState = {};

/**
 * Formulário de evento reutilizado em criar (na lista) e editar (rota própria).
 */
export function AdminEventForm({
  action,
  categories,
  isEdit = false,
  initial,
}: {
  action: Action;
  categories: CategoryOption[];
  isEdit?: boolean;
  initial?: EventFormInitial;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(action, initialState);
  const [cover, setCover] = useState(initial?.coverImage ?? "");
  const [resetKey, setResetKey] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!isEdit && state.ok) {
      formRef.current?.reset();
      setCover("");
      setResetKey((k) => k + 1);
      pushToast("Evento cadastrado com sucesso.", "success");
      router.refresh();
    }
    if (state.error) pushToast(state.error, "error");
  }, [state, isEdit, router]);

  return (
    <>
      {state.error && <div className="form-error">{state.error}</div>}
      <form ref={formRef} action={formAction}>
        <div className="form-grid">
          <div className="stack">
            <div className="field">
              <label htmlFor="title">Nome do evento</label>
              <input id="title" name="title" className="input" type="text" placeholder="Ex.: Raros Boa Vista Conf 2024" defaultValue={initial?.title ?? ""} required />
            </div>
            <div className="field">
              <label htmlFor="description">Descrição</label>
              <textarea id="description" name="description" className="textarea" placeholder="Sobre o evento, palestras e atrações" defaultValue={initial?.description ?? ""} />
            </div>
            <div className="row-2">
              <div className="field">
                <label htmlFor="categoryId">Categoria</label>
                <div className="selnative">
                  <select id="categoryId" name="categoryId" className="select" defaultValue={initial?.categoryId ?? ""}>
                    <option value="">Selecione</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <Chevron />
                </div>
              </div>
              <div className="field">
                <label htmlFor="format">Formato</label>
                <div className="selnative">
                  <select id="format" name="format" className="select" defaultValue={initial?.format ?? EventFormat.Presential}>
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
              <input id="location" name="location" className="input" type="text" placeholder="Ex.: Centro de Convenções · São Paulo, SP" defaultValue={initial?.location ?? ""} />
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
                <input id="date" name="date" className="input" type="text" placeholder="dd/mm/aaaa" defaultValue={initial?.date ?? ""} required />
              </div>
              <div className="field">
                <label htmlFor="time">Horário</label>
                <input id="time" name="time" className="input" type="text" placeholder="hh:mm" defaultValue={initial?.time ?? "09:00"} />
              </div>
            </div>
            <div className="field">
              <label htmlFor="capacity">Capacidade (vagas)</label>
              <input id="capacity" name="capacity" className="input" type="text" placeholder="Ex.: 350" defaultValue={initial?.capacity ?? ""} />
            </div>
          </div>
        </div>

        <div className="form-actions">
          {isEdit ? (
            <button className="btn btn-ghost" type="button" onClick={() => router.push("/admin/eventos")}>
              Cancelar
            </button>
          ) : (
            <button className="btn btn-ghost" type="reset">
              Limpar
            </button>
          )}
          <button className="btn btn-primary" type="submit" disabled={pending}>
            {pending ? "Salvando..." : isEdit ? "Salvar alterações" : "Cadastrar evento"}
          </button>
        </div>
      </form>
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
