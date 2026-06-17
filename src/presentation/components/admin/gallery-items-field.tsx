"use client";

import { useState } from "react";
import { deleteGalleryItemAction } from "@/presentation/actions/post-actions";
import { ImageSlot } from "../image-slot";
import { PlusIcon, TrashIcon, LinkIcon } from "../icons";
import { pushToast } from "./toast";

export interface PostOption {
  id: string;
  title: string;
}

export interface GalleryItem {
  id?: string;
  image: string | null;
  caption: string | null;
  linkedPostId: string | null;
}

interface GalleryItemsFieldProps {
  /** Id do post atual, presente na edição. */
  postId?: string;
  /** Posts que podem ser vinculados aos itens da galeria. */
  postOptions: PostOption[];
  /** Itens já existentes ao editar um post. */
  initialItems?: GalleryItem[];
}

const emptyItem: GalleryItem = { image: null, caption: null, linkedPostId: null };

/**
 * Seção opcional de galeria (projetos) embutida no formulário de post.
 * Começa vazia — adicionar itens é opcional. Cada item recebe uma imagem e,
 * opcionalmente, aponta para outro post (clicar abre esse post) ou abre em
 * lightbox quando sem vínculo. Emite os itens no campo oculto `items`.
 */
export function GalleryItemsField({ postId, postOptions, initialItems }: GalleryItemsFieldProps) {
  const [items, setItems] = useState<GalleryItem[]>(initialItems ?? []);
  /** Índice do item aguardando confirmação de remoção (1º clique na lixeira). */
  const [confirming, setConfirming] = useState<number | null>(null);
  /** Último item removido, para permitir desfazer. */
  const [lastRemoved, setLastRemoved] = useState<{ item: GalleryItem; index: number } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function update(i: number, patch: Partial<GalleryItem>) {
    setItems((cur) => cur.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }
  async function remove(i: number) {
    const item = items[i];
    setDeleteError(null);

    if (item?.id && postId) {
      setDeletingId(item.id);
      const result = await deleteGalleryItemAction(postId, item.id);
      setDeletingId(null);
      if (result.error) {
        setDeleteError(result.error);
        pushToast(result.error, "error");
        return;
      }
    }

    setItems((cur) => {
      const removed = cur[i];
      if (removed && !removed.id) setLastRemoved({ item: removed, index: i });
      return cur.filter((_, idx) => idx !== i);
    });
    setConfirming(null);
    pushToast("Item da galeria removido com sucesso.", "success");
  }
  function undoRemove() {
    if (!lastRemoved) return;
    setItems((cur) => {
      const next = [...cur];
      next.splice(Math.min(lastRemoved.index, next.length), 0, lastRemoved.item);
      return next;
    });
    setLastRemoved(null);
  }
  function add() {
    setItems((cur) => [...cur, { ...emptyItem }]);
    setConfirming(null);
  }

  return (
    <div className="panel" style={{ marginTop: 26 }}>
      <div className="panel-head">
        <h2>Galeria de projetos (opcional)</h2>
        <span className="count">
          {items.length} {items.length === 1 ? "item" : "itens"}
        </span>
      </div>
      <div className="panel-pad">
        <p style={{ margin: "0 0 18px", color: "var(--muted)", fontSize: 13.5 }}>
          Adicione imagens apenas se quiser. Cada item pode apontar para um{" "}
          <strong>post existente</strong> (clicar abre esse post) ou, sem vínculo, abrir a
          imagem ampliada no site.
        </p>
        {lastRemoved && (
          <div className="proj-undo">
            <span>
              <TrashIcon /> Item removido.
            </span>
            <button type="button" onClick={undoRemove}>
              Desfazer
            </button>
          </div>
        )}
        {deleteError && <div className="form-error">{deleteError}</div>}
        {items.length > 0 && (
          <div className="proj-list">
            {items.map((it, i) => (
              <div className={`proj-item${confirming === i ? " removing" : ""}`} key={i}>
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
                      Post vinculado (opcional)
                    </label>
                    <div className="selnative">
                      <select
                        className="select"
                        value={it.linkedPostId ?? ""}
                        onChange={(e) => update(i, { linkedPostId: e.target.value || null })}
                      >
                        <option value="">Nenhum — abrir imagem ampliada</option>
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
                  {it.linkedPostId && (
                    <span className="linkrow">
                      <LinkIcon /> Abre o post selecionado ao clicar
                    </span>
                  )}
                </div>
                {confirming === i ? (
                  <div className="proj-remove-confirm">
                    <button
                      type="button"
                      className="confirm-yes"
                      title="Confirmar remoção"
                      onClick={() => remove(i)}
                      disabled={deletingId === it.id}
                    >
                      <TrashIcon /> {deletingId === it.id ? "Excluindo..." : "Excluir"}
                    </button>
                    <button
                      type="button"
                      className="confirm-no"
                      title="Cancelar"
                      onClick={() => setConfirming(null)}
                      disabled={deletingId === it.id}
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="proj-remove"
                    title="Remover"
                    onClick={() => setConfirming(i)}
                  >
                    <TrashIcon />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
        <button type="button" className="add-proj" onClick={add}>
          <PlusIcon /> Adicionar item
        </button>
      </div>

      <input type="hidden" name="items" value={JSON.stringify(items)} />
    </div>
  );
}

function Chevron() {
  return (
    <svg
      className="chev"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
