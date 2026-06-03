"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { CategoryView } from "@/core/domain/category/category.repository";
import { PostStatus, PostType } from "@/core/domain/post/post-status";
import { PostDetail } from "@/core/domain/post/post.repository";
import { ImageSlot } from "../image-slot";
import { ProjectBuilder, PostOption, BuilderItem } from "./project-builder";
import type { PostFormState } from "@/presentation/actions/post-actions";
import type { ProjectFormState } from "@/presentation/actions/project-actions";

type Action = (state: PostFormState, formData: FormData) => Promise<PostFormState>;
type ProjectAction = (
  state: ProjectFormState,
  formData: FormData,
) => Promise<ProjectFormState>;

interface GalleryInitial {
  title: string;
  description: string;
  categoryId: string | null;
  status: PostStatus;
  items: BuilderItem[];
}

interface PostFormProps {
  action: Action;
  categories: CategoryView[];
  post?: PostDetail & { categoryId?: string | null };
  /** categoria atual ao editar (id), já que o read model traz apenas slug. */
  currentCategoryId?: string | null;
  /** Quando fornecido, habilita o tipo "Projetos (galeria)" no seletor. */
  projectAction?: ProjectAction;
  /** Posts que podem ser vinculados aos itens da galeria. */
  postOptions?: PostOption[];
  /** Dados iniciais da galeria ao editar um post que já a possui. */
  galleryInitial?: GalleryInitial;
}

const initial: PostFormState = {};

export function PostForm({
  action,
  categories,
  post,
  currentCategoryId,
  projectAction,
  postOptions,
  galleryInitial,
}: PostFormProps) {
  const [state, formAction, pending] = useActionState(action, initial);
  const [cover, setCover] = useState<string>(post?.coverImage ?? "");

  const isEdit = Boolean(post);
  const galleryEnabled = Boolean(projectAction);
  // Ao editar um post que já tem galeria, abre direto no modo galeria.
  const startsAsGallery = galleryEnabled && Boolean(galleryInitial?.items.length);
  const [type, setType] = useState<PostType>(
    startsAsGallery ? PostType.Projects : (post?.type as PostType) ?? PostType.Standard,
  );
  const isGallery = galleryEnabled && type === PostType.Projects;

  return (
    <>
      <div className="page-top">
        <div>
          <h1>
            {isGallery
              ? "Nova coleção de Projetos"
              : isEdit
                ? "Editar Post"
                : "Novo Post"}
          </h1>
          <div className="sub">Escolha o tipo de post e monte o conteúdo</div>
        </div>
      </div>

      <div className="field" style={{ marginBottom: 6 }}>
        <span className="lbl">Tipo de post</span>
      </div>
      <div className="typebar">
        <div
          className={`type-opt${type === PostType.Standard ? " active" : ""}`}
          role="button"
          tabIndex={0}
          style={{ cursor: "pointer" }}
          onClick={() => setType(PostType.Standard)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setType(PostType.Standard);
          }}
        >
          <span className="ti">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 6h16M4 12h16M4 18h10" />
            </svg>
          </span>
          <span>
            <h4>Padrão</h4>
            <p>Texto, imagens e código</p>
          </span>
        </div>
        <div
          className={`type-opt${isGallery ? " active" : ""}`}
          role={galleryEnabled ? "button" : undefined}
          tabIndex={galleryEnabled ? 0 : undefined}
          title={galleryEnabled ? undefined : "Disponível ao criar um post"}
          style={{
            cursor: galleryEnabled ? "pointer" : "default",
            opacity: galleryEnabled ? 1 : 0.55,
          }}
          onClick={() => galleryEnabled && setType(PostType.Projects)}
          onKeyDown={(e) => {
            if (galleryEnabled && (e.key === "Enter" || e.key === " ")) {
              setType(PostType.Projects);
            }
          }}
        >
          <span className="ti">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </span>
          <span>
            <h4>Projetos (galeria)</h4>
            <p>Grade de imagens que abrem outros posts</p>
          </span>
        </div>
      </div>

      {isGallery ? (
        <ProjectBuilder
          embedded
          isEdit={isEdit}
          action={projectAction!}
          categories={categories}
          postOptions={postOptions ?? []}
          cancelHref="/admin/posts"
          initial={galleryInitial}
        />
      ) : (
        <form action={formAction}>
          {state.error && <div className="form-error">{state.error}</div>}

          <div className="form-grid">
            <div>
              <div className="field" style={{ marginBottom: 22 }}>
                <label htmlFor="title">Título</label>
                <input
                  id="title"
                  name="title"
                  className="input"
                  type="text"
                  placeholder="Digite o título do post"
                  defaultValue={post?.title ?? ""}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="excerpt">Resumo</label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  className="textarea"
                  rows={3}
                  placeholder="Digite um resumo do post (opcional)"
                  defaultValue={post?.excerpt ?? ""}
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="categoryId">Menu</label>
              <div className="selnative">
                <select
                  id="categoryId"
                  name="categoryId"
                  className="select"
                  defaultValue={currentCategoryId ?? ""}
                >
                  <option value="">Selecione o menu</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <svg className="chev" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="field" style={{ marginTop: 22 }}>
            <span className="lbl">Conteúdo</span>
            <div className="editor">
              <div className="toolbar">
                <button type="button" className="tb" title="Negrito"><b>B</b></button>
                <button type="button" className="tb" title="Itálico"><i>I</i></button>
                <button type="button" className="tb" title="Título 1">H1</button>
                <button type="button" className="tb" title="Título 2">H2</button>
                <span className="tb-div" />
                <button type="button" className="tb" title="Código">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 8-4 4 4 4M15 8l4 4-4 4" />
                  </svg>
                </button>
              </div>
              <textarea
                className="area"
                name="content"
                placeholder="Escreva o conteúdo do post aqui..."
                defaultValue={post?.content ?? ""}
              />
            </div>
          </div>

          <div className="form-grid" style={{ marginTop: 22 }}>
            <div className="field">
              <span className="lbl">Imagem de capa</span>
              <div
                className="dropzone"
                style={{ position: "relative", height: 170, padding: 0, overflow: "hidden" }}
              >
                <ImageSlot
                  src={cover || null}
                  placeholder="Clique para enviar uma imagem ou arraste e solte"
                  editable
                  onChange={setCover}
                />
              </div>
              <input type="hidden" name="coverImage" value={cover} />
            </div>
            <div className="stack">
              <div className="field">
                <label htmlFor="status">Status</label>
                <div className="selnative">
                  <select
                    id="status"
                    name="status"
                    className="select"
                    defaultValue={post?.status ?? PostStatus.Draft}
                  >
                    <option value={PostStatus.Draft}>Rascunho</option>
                    <option value={PostStatus.Published}>Publicado</option>
                  </select>
                  <svg className="chev" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <Link className="btn btn-ghost" href="/admin/posts">
              Cancelar
            </Link>
            <button className="btn btn-primary" type="submit" disabled={pending}>
              {pending ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      )}
    </>
  );
}
