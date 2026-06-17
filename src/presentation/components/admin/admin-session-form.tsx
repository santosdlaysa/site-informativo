"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { SessionStatus, SESSION_STATUS_LABEL } from "@/core/domain/program/session-status";
import type { SessionFormState } from "@/presentation/actions/program-actions";
import { pushToast } from "./toast";

export interface CategoryOption {
  id: string;
  name: string;
}

export interface SessionFormInitial {
  title?: string;
  description?: string;
  speaker?: string;
  speakerRole?: string;
  categoryId?: string | null;
  date?: string;
  time?: string;
  durationMin?: string;
  status?: SessionStatus;
}

type Action = (prev: SessionFormState, formData: FormData) => Promise<SessionFormState>;

const initialState: SessionFormState = {};

/** Aplica a máscara dd/mm/aaaa enquanto o usuário digita (apenas dígitos). */
function maskDate(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  let out = digits.slice(0, 2);
  if (digits.length >= 3) out += "/" + digits.slice(2, 4);
  if (digits.length >= 5) out += "/" + digits.slice(4, 8);
  return out;
}

/**
 * Formulário de sessão reutilizado em criar (na lista) e editar (rota própria).
 * Em criação, limpa o form e atualiza a lista no sucesso; em edição, a própria
 * action redireciona de volta para a lista.
 */
export function AdminSessionForm({
  action,
  categories,
  isEdit = false,
  initial,
}: {
  action: Action;
  categories: CategoryOption[];
  isEdit?: boolean;
  initial?: SessionFormInitial;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(action, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!isEdit && state.ok) {
      formRef.current?.reset();
      pushToast("Sessão cadastrada com sucesso.", "success");
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
              <label htmlFor="title">Título da sessão</label>
              <input id="title" name="title" className="input" type="text" placeholder="Ex.: Prisma + PostgreSQL na prática" defaultValue={initial?.title ?? ""} required />
            </div>
            <div className="field">
              <label htmlFor="description">Descrição</label>
              <textarea id="description" name="description" className="textarea" placeholder="Resumo do que será abordado na sessão" defaultValue={initial?.description ?? ""} />
            </div>
            <div className="row-2">
              <div className="field">
                <label htmlFor="speaker">Palestrante</label>
                <input id="speaker" name="speaker" className="input" type="text" placeholder="Nome do palestrante" defaultValue={initial?.speaker ?? ""} />
              </div>
              <div className="field">
                <label htmlFor="speakerRole">Cargo / função</label>
                <input id="speakerRole" name="speakerRole" className="input" type="text" placeholder="Ex.: Engenheira de Software" defaultValue={initial?.speakerRole ?? ""} />
              </div>
            </div>
          </div>

          <div className="stack">
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
            <div className="row-2">
              <div className="field">
                <label htmlFor="date">Data</label>
                <input
                  id="date"
                  name="date"
                  className="input"
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="dd/mm/aaaa"
                  defaultValue={initial?.date ?? ""}
                  onChange={(e) => {
                    e.currentTarget.value = maskDate(e.currentTarget.value);
                  }}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="time">Horário</label>
                <input id="time" name="time" className="input" type="text" placeholder="hh:mm" defaultValue={initial?.time ?? "10:00"} />
              </div>
            </div>
            <div className="row-2">
              <div className="field">
                <label htmlFor="durationMin">Duração (min)</label>
                <input id="durationMin" name="durationMin" className="input" type="text" defaultValue={initial?.durationMin ?? "60"} />
              </div>
              <div className="field">
                <label htmlFor="status">Status</label>
                <div className="selnative">
                  <select id="status" name="status" className="select" defaultValue={initial?.status ?? SessionStatus.Scheduled}>
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
          </div>
        </div>

        <div className="form-actions">
          {isEdit ? (
            <button className="btn btn-ghost" type="button" onClick={() => router.push("/admin/programacao")}>
              Cancelar
            </button>
          ) : (
            <button className="btn btn-ghost" type="reset">
              Limpar
            </button>
          )}
          <button className="btn btn-primary" type="submit" disabled={pending}>
            {pending ? "Salvando..." : isEdit ? "Salvar alterações" : "Cadastrar sessão"}
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
