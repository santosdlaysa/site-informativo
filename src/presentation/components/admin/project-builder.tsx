"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { CategoryView } from "@/core/domain/category/category.repository";
import { PostStatus } from "@/core/domain/post/post-status";
import type { ProjectFormState } from "@/presentation/actions/project-actions";
import { ImageSlot } from "../image-slot";
import { PlusIcon, TrashIcon, LinkIcon } from "../icons";

export interface PostOption {
  id: string;
  title: string;
}

export interface BuilderItem {
  image: string | null;
  caption: string | null;
  linkedPostId: string | null;
}

interface ProjectBuilderProps {
  action: (state: ProjectFormState, formData: FormData) => Promise<ProjectFormState>;
  categories: CategoryView[];
  postOptions: PostOption[];
  isEdit?: boolean;
  /** Esconde o cabeçalho próprio quando embutido em outro formulário (ex.: novo post). */
  embedded?: boolean;
  /** Para onde o botão "Cancelar" volta. Padrão: lista de posts. */
  cancelHref?: string;
  initial?: {
    title: string;
    description: string;
    categoryId: string | null;
    status: PostStatus;
    items: BuilderItem[];
  };
}

const emptyItem: BuilderItem = { image: null, caption: null, linkedPostId: null };
const initialState: ProjectFormState = {};

export function ProjectBuilder({
  action,
  categories,
  postOptions,
  isEdit,
  embedded,
  cancelHref = "/admin/posts",
  initial,
}: ProjectBuilderProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [items, setItems] = useState<BuilderItem[]>(
    initial?.items?.length ? initial.items : [{ ...emptyItem }],
  );

  function update(i: number, patch: Partial<BuilderItem>) {
    setItems((cur) => cur.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }
  function remove(i: number) {
    setItems((cur) => cur.filter((_, idx) => idx !== i));
  }
  function add() {
    setItems((cur) => [...cur, { ...emptyItem }]);
  }

  return (
    <form action={formAction}>
      {!embedded && (
        <div className="page-top">
          <div>
            <h1>{isEdit ? "Editar coleção" : "Nova coleção de Projetos"}</h1>
            <div className="sub">Monte uma galeria de imagens que abrem posts existentes</div>
          </div>
        </div>
      )}

      {state.error && <div className="form-error">{state.error}</div>}

      <div className="form-grid">
        <div className="stack">
          <div className="field">
            <label htmlFor="title">Título da coleção</label>
            <input id="title" name="title" className="input" type="text" placeholder="Ex.: Nossos Projetos" defaultValue={initial?.title ?? ""} required />
          </div>
          <div className="field">
            <label htmlFor="description">Descrição</label>
            <textarea id="description" name="description" className="textarea" placeholder="Texto introdutório que aparece antes da galeria" defaultValue={initial?.description ?? ""} />
          </div>
        </div>
        <div className="stack">
          <div className="field">
            <label htmlFor="categoryId">Menu</label>
            <div className="selnative">
              <select id="categoryId" name="categoryId" className="select" defaultValue={initial?.categoryId ?? ""}>
                <option value="">Selecione o menu</option>
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
            <label htmlFor="status">Status</label>
            <div className="selnative">
              <select id="status" name="status" className="select" defaultValue={initial?.status ?? PostStatus.Draft}>
                <option value={PostStatus.Draft}>Rascunho</option>
                <option value={PostStatus.Published}>Publicado</option>
              </select>
              <Chevron />
            </div>
          </div>
        </div>
      </div>

      <div className="panel" style={{ marginTop: 26 }}>
        <div className="panel-head">
          <h2>Itens da galeria</h2>
          <span className="count">
            {items.length} {items.length === 1 ? "item" : "itens"}
          </span>
        </div>
        <div className="panel-pad">
          <p style={{ margin: "0 0 18px", color: "var(--muted)", fontSize: 13.5 }}>
            Cada item recebe uma imagem e aponta para um <strong>post existente</strong>. No site,
            clicar na imagem abre esse post.
          </p>
          <div className="proj-list">
            {items.map((it, i) => (
              <div className="proj-item" key={i}>
                <div className="proj-thumb">
                  <ImageSlot
                    src={it.image}
                    placeholder="Enviar imagem"
                    editable
                    onChange={(url) => update(i, { image: url })}
                  />
                </div>
                <div className="proj-fields">
                  <div className="field" style={{ margin: 0 }}>
                    <label className="lbl" style={{ marginBottom: 6 }}>
                      Post vinculado
                    </label>
                    <div className="selnative">
                      <select
                        className="select"
                        value={it.linkedPostId ?? ""}
                        onChange={(e) => update(i, { linkedPostId: e.target.value || null })}
                      >
                        <option value="">Selecione um post</option>
                        {postOptions.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.title}
                          </option>
                        ))}
                      </select>
                      <Chevron />
                    </div>
                  </div>
                  <div className="field" style={{ margin: 0 }}>
                    <label className="lbl" style={{ marginBottom: 6 }}>
                      Legenda (opcional)
                    </label>
                    <input
                      className="input"
                      type="text"
                      placeholder="Texto sobre a imagem"
                      value={it.caption ?? ""}
                      onChange={(e) => update(i, { caption: e.target.value || null })}
                    />
                  </div>
                  <span className="linkrow">
                    <LinkIcon /> Abre o post selecionado ao clicar
                  </span>
                </div>
                <button type="button" className="proj-remove" title="Remover" onClick={() => remove(i)}>
                  <TrashIcon />
                </button>
              </div>
            ))}
          </div>
          <button type="button" className="add-proj" onClick={add}>
            <PlusIcon /> Adicionar item
          </button>
        </div>
      </div>

      <input type="hidden" name="items" value={JSON.stringify(items)} />

      <div className="form-actions">
        <Link className="btn btn-ghost" href={cancelHref}>
          Cancelar
        </Link>
        <button className="btn btn-primary" type="submit" disabled={pending}>
          {pending ? "Salvando..." : "Salvar coleção"}
        </button>
      </div>
    </form>
  );
}

function Chevron() {
  return (
    <svg className="chev" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
