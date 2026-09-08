"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createTransparencyDocumentAction,
  deleteTransparencyDocumentAction,
  updateTransparencyDocumentAction,
  updateTransparencyIntroAction,
  type TransparencyFormState,
} from "@/presentation/actions/transparency-actions";
import { pushToast } from "./toast";
import { CollapsiblePanel, PanelSummary, PanelSummaryItem } from "./collapsible-panel";
import { EditIcon, EyeIcon, TrashIcon } from "../icons";

type DocumentRow = {
  id: string;
  title: string;
  description: string | null;
  referenceYear: number | null;
  fileName: string;
  fileSize: number;
};

const initial: TransparencyFormState = {};
const accept = ".pdf,.doc,.docx,.xls,.xlsx,.csv,.jpg,.jpeg,.png";

function StateFeedback({ state, success }: { state: TransparencyFormState; success: string }) {
  useEffect(() => {
    if (state.success) pushToast(success, "success");
    if (state.error) pushToast(state.error, "error");
  }, [state, success]);
  return state.error ? <div className="form-error">{state.error}</div> : null;
}

export function TransparencyManager({
  title,
  description,
  documents,
}: {
  title: string;
  description: string;
  documents: DocumentRow[];
}) {
  const [introState, introAction, introPending] = useActionState(updateTransparencyIntroAction, initial);
  const [createState, createAction, createPending] = useActionState(createTransparencyDocumentAction, initial);
  const [editingIntro, setEditingIntro] = useState(false);
  const [creatingDocument, setCreatingDocument] = useState(false);
  const [editingDocument, setEditingDocument] = useState<DocumentRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const createForm = useRef<HTMLFormElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (createState.success) {
      createForm.current?.reset();
      setCreatingDocument(false);
    }
  }, [createState.success]);

  useEffect(() => {
    if (introState.success) setEditingIntro(false);
  }, [introState]);

  async function handleUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingDocument) return;

    setSaving(true);
    try {
      await updateTransparencyDocumentAction(editingDocument.id, new FormData(event.currentTarget));
      pushToast("Documento atualizado com sucesso.", "success");
      setEditingDocument(null);
      router.refresh();
    } catch (error) {
      pushToast(error instanceof Error ? error.message : "Não foi possível atualizar o documento.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(document: DocumentRow) {
    if (!confirm(`Excluir o documento “${document.title}”?`)) return;

    setDeletingId(document.id);
    try {
      await deleteTransparencyDocumentAction(document.id);
      pushToast("Documento excluído com sucesso.", "success");
      router.refresh();
    } catch (error) {
      pushToast(error instanceof Error ? error.message : "Não foi possível excluir o documento.", "error");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <div className="page-top">
        <div>
          <h1>Portal da Transparência</h1>
          <div className="sub">Edite a apresentação e publique documentos do ADSocial</div>
        </div>
        <a href="https://adsocialoficial.org/transparencia" target="_blank" rel="noreferrer" className="btn">
          Ver página pública
        </a>
      </div>

      <CollapsiblePanel
        title="Apresentação da página"
        actionLabel="Editar apresentação"
        className="transparency-admin-section"
        open={editingIntro}
        onOpenChange={setEditingIntro}
        summary={
          <PanelSummary>
            <PanelSummaryItem label="Título" value={title} />
            <PanelSummaryItem label="Texto de apresentação" value={description} multiline />
          </PanelSummary>
        }
      >
        <form action={introAction}>
          <StateFeedback state={introState} success="Apresentação salva com sucesso." />
          <div className="field">
            <label htmlFor="transparencyTitle">Título</label>
            <input id="transparencyTitle" name="transparencyTitle" className="input" defaultValue={title} required minLength={3} />
          </div>
          <div className="field">
            <label htmlFor="transparencyDescription">Texto de apresentação</label>
            <textarea id="transparencyDescription" name="transparencyDescription" className="textarea" rows={4} defaultValue={description} required minLength={10} />
          </div>
          <div className="form-actions">
            <button className="btn btn-ghost" type="button" disabled={introPending} onClick={() => setEditingIntro(false)}>Cancelar</button>
            <button className="btn btn-primary" disabled={introPending}>{introPending ? "Salvando..." : "Salvar apresentação"}</button>
          </div>
        </form>
      </CollapsiblePanel>

      <CollapsiblePanel
        title="Publicar novo documento"
        actionLabel="Publicar documento"
        actionIcon="plus"
        className="transparency-admin-section"
        open={creatingDocument}
        onOpenChange={setCreatingDocument}
      >
        <form ref={createForm} action={createAction} className="transparency-admin-form">
          <StateFeedback state={createState} success="Documento publicado com sucesso." />
          <div className="transparency-form-grid">
            <div className="field transparency-field-wide">
              <label htmlFor="title">Título do documento</label>
              <input id="title" name="title" className="input" required minLength={3} placeholder="Ex.: Relatório anual de atividades" />
            </div>
            <div className="field">
              <label htmlFor="referenceYear">Ano de referência</label>
              <input id="referenceYear" name="referenceYear" className="input" type="number" min="1900" max="2200" placeholder="2026" />
            </div>
            <div className="field transparency-field-wide">
              <label htmlFor="description">Descrição / informação complementar</label>
              <textarea id="description" name="description" className="textarea" rows={3} placeholder="Explique brevemente o conteúdo deste documento." />
            </div>
            <div className="field transparency-field-wide">
              <label htmlFor="file">Arquivo</label>
              <input id="file" name="file" className="input transparency-file-input" type="file" accept={accept} required />
              <div className="hint">PDF, Word, Excel, CSV, JPG ou PNG — máximo de 3 MB.</div>
            </div>
          </div>
          <div className="form-actions">
            <button className="btn btn-ghost" type="button" disabled={createPending} onClick={() => setCreatingDocument(false)}>Cancelar</button>
            <button className="btn btn-primary" disabled={createPending}>{createPending ? "Publicando..." : "Publicar documento"}</button>
          </div>
        </form>
      </CollapsiblePanel>

      <section className="panel">
        <div className="panel-head">
          <h2>Documentos cadastrados</h2>
          <span className="count">{documents.length} {documents.length === 1 ? "documento" : "documentos"}</span>
        </div>
        <table className="tbl transparency-documents-table">
          <thead>
            <tr>
              <th>Documento</th>
              <th>Ano</th>
              <th>Arquivo</th>
              <th style={{ width: 142 }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {documents.length === 0 ? (
              <tr className="empty-row">
                <td colSpan={4}>Nenhum documento cadastrado.</td>
              </tr>
            ) : documents.map((document) => (
              <tr key={document.id}>
                <td>
                  <div className="t-title">
                    {document.title}
                    <div className="t-sub">{document.description || "Sem descrição"}</div>
                  </div>
                </td>
                <td>{document.referenceYear ?? "—"}</td>
                <td>
                  <div className="transparency-file-name" title={document.fileName}>{document.fileName}</div>
                  <div className="t-sub">{formatFileSize(document.fileSize)}</div>
                </td>
                <td className="act-cell">
                  <div className="act-inline transparency-table-actions">
                    <a className="transparency-table-action" href={`/api/transparencia/${document.id}`} target="_blank" rel="noreferrer" title="Abrir documento" aria-label={`Abrir ${document.title}`}>
                      <EyeIcon />
                    </a>
                    <button type="button" title="Editar documento" aria-label={`Editar ${document.title}`} onClick={() => setEditingDocument(document)}>
                      <EditIcon />
                    </button>
                    <button type="button" className="danger" title="Excluir documento" aria-label={`Excluir ${document.title}`} disabled={deletingId === document.id} onClick={() => void handleDelete(document)}>
                      <TrashIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {editingDocument && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => !saving && setEditingDocument(null)}>
          <div className="modal-card transparency-edit-modal" role="dialog" aria-modal="true" aria-labelledby="edit-transparency-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="modal-head">
              <div>
                <h2 id="edit-transparency-title">Editar documento</h2>
                <div className="t-sub">{editingDocument.fileName} · {formatFileSize(editingDocument.fileSize)}</div>
              </div>
              <button type="button" className="modal-close" aria-label="Fechar" disabled={saving} onClick={() => setEditingDocument(null)}>×</button>
            </div>
            <form className="modal-body" onSubmit={(event) => void handleUpdate(event)}>
              <div className="transparency-form-grid">
                <div className="field transparency-field-wide">
                  <label htmlFor="edit-document-title">Título</label>
                  <input id="edit-document-title" name="title" className="input" defaultValue={editingDocument.title} required minLength={3} />
                </div>
                <div className="field">
                  <label htmlFor="edit-document-year">Ano</label>
                  <input id="edit-document-year" name="referenceYear" className="input" type="number" min="1900" max="2200" defaultValue={editingDocument.referenceYear ?? ""} />
                </div>
                <div className="field transparency-field-wide">
                  <label htmlFor="edit-document-description">Descrição</label>
                  <textarea id="edit-document-description" name="description" className="textarea" rows={3} defaultValue={editingDocument.description ?? ""} />
                </div>
                <div className="field transparency-field-wide">
                  <label htmlFor="edit-document-file">Substituir arquivo (opcional)</label>
                  <input id="edit-document-file" name="file" className="input transparency-file-input" type="file" accept={accept} />
                  <div className="hint">Deixe vazio para manter o arquivo atual.</div>
                </div>
              </div>
              <div className="form-actions">
                <button className="btn" type="button" disabled={saving} onClick={() => setEditingDocument(null)}>Cancelar</button>
                <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? "Salvando..." : "Salvar alterações"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
