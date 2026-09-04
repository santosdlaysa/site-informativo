"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  createTransparencyDocumentAction,
  deleteTransparencyDocumentAction,
  updateTransparencyDocumentAction,
  updateTransparencyIntroAction,
  type TransparencyFormState,
} from "@/presentation/actions/transparency-actions";
import { pushToast } from "./toast";

type DocumentRow = {
  id: string;
  title: string;
  description: string | null;
  category: string;
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
  const createForm = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (createState.success) createForm.current?.reset();
  }, [createState.success]);

  return (
    <>
      <div className="page-top">
        <div>
          <h1>Portal da Transparência</h1>
          <div className="sub">Edite a apresentação e publique documentos do ADSocial</div>
        </div>
        <a href="/adsocial/transparencia" target="_blank" rel="noreferrer" className="btn">
          Ver página pública
        </a>
      </div>

      <form action={introAction} className="panel transparency-admin-section">
        <div className="panel-head"><h2>Apresentação da página</h2></div>
        <div className="panel-pad">
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
            <button className="btn btn-primary" disabled={introPending}>{introPending ? "Salvando..." : "Salvar apresentação"}</button>
          </div>
        </div>
      </form>

      <form ref={createForm} action={createAction} className="panel transparency-admin-section">
        <div className="panel-head"><h2>Publicar novo documento</h2></div>
        <div className="panel-pad transparency-admin-form">
          <StateFeedback state={createState} success="Documento publicado com sucesso." />
          <div className="transparency-form-grid">
            <div className="field transparency-field-wide">
              <label htmlFor="title">Título do documento</label>
              <input id="title" name="title" className="input" required minLength={3} placeholder="Ex.: Relatório anual de atividades" />
            </div>
            <div className="field">
              <label htmlFor="category">Categoria</label>
              <input id="category" name="category" className="input" required list="transparency-categories" placeholder="Relatórios" />
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
            <button className="btn btn-primary" disabled={createPending}>{createPending ? "Publicando..." : "Publicar documento"}</button>
          </div>
        </div>
      </form>

      <datalist id="transparency-categories">
        <option value="Relatórios" /><option value="Prestação de contas" /><option value="Contratos" />
        <option value="Convênios" /><option value="Institucional" /><option value="Outros" />
      </datalist>

      <section className="panel">
        <div className="panel-head">
          <h2>Documentos cadastrados</h2>
          <span className="count">{documents.length} {documents.length === 1 ? "documento" : "documentos"}</span>
        </div>
        <div className="transparency-admin-list">
          {documents.length === 0 && <p className="transparency-admin-empty">Nenhum documento cadastrado.</p>}
          {documents.map((document) => (
            <form key={document.id} action={updateTransparencyDocumentAction.bind(null, document.id)} className="transparency-admin-card">
              <div className="transparency-admin-card-head">
                <div><strong>{document.fileName}</strong><span>{formatFileSize(document.fileSize)}</span></div>
              </div>
              <div className="transparency-form-grid">
                <div className="field transparency-field-wide"><label>Título</label><input name="title" className="input" defaultValue={document.title} required /></div>
                <div className="field"><label>Categoria</label><input name="category" className="input" defaultValue={document.category} required list="transparency-categories" /></div>
                <div className="field"><label>Ano</label><input name="referenceYear" className="input" type="number" min="1900" max="2200" defaultValue={document.referenceYear ?? ""} /></div>
                <div className="field transparency-field-wide"><label>Descrição</label><textarea name="description" className="textarea" rows={2} defaultValue={document.description ?? ""} /></div>
                <div className="field transparency-field-wide"><label>Substituir arquivo (opcional)</label><input name="file" className="input transparency-file-input" type="file" accept={accept} /></div>
              </div>
              <div className="transparency-admin-actions">
                <div>
                  <a className="btn" href={`/api/transparencia/${document.id}`} target="_blank" rel="noreferrer">Abrir</a>
                  <button className="btn btn-primary" type="submit">Salvar</button>
                  <button className="btn transparency-delete" type="submit" formAction={deleteTransparencyDocumentAction.bind(null, document.id)} formNoValidate onClick={(event) => { if (!confirm("Excluir este documento?")) event.preventDefault(); }}>Excluir</button>
                </div>
              </div>
            </form>
          ))}
        </div>
      </section>
    </>
  );
}

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
