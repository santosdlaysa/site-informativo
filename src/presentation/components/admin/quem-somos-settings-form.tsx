"use client";

import { useActionState, useCallback, useRef, useState } from "react";
import type { SiteSettingsData } from "@/core/domain/settings/site-settings";
import {
  updateQuemSomosAction,
  type SettingsFormState,
} from "@/presentation/actions/settings-actions";

const initial: SettingsFormState = {};
const ACCEPT = ["image/png", "image/jpeg", "image/webp", "image/avif"];
const MAX_DIM = 1600;

async function fileToDataUrl(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIM / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();
  return canvas.toDataURL("image/webp", 0.85);
}

export function QuemSomosSettingsForm({ settings }: { settings: SiteSettingsData }) {
  const [state, formAction, pending] = useActionState(updateQuemSomosAction, initial);
  const [qsImage, setQsImage] = useState<string>(settings.qsImage ?? "");
  const qsInputRef = useRef<HTMLInputElement>(null);

  const ingestQs = useCallback(async (file: File | undefined) => {
    if (!file || !ACCEPT.includes(file.type)) return;
    setQsImage(await fileToDataUrl(file));
  }, []);

  return (
    <form action={formAction} className="panel">
      <div className="panel-head">
        <h2>Seção &quot;Quem Somos&quot;</h2>
      </div>
      <div className="panel-pad">
        {state.error && <div className="form-error">{state.error}</div>}
        {state.success && (
          <div className="form-error" style={{ background: "#ecfdf5", color: "#047857", borderColor: "#a7f3d0" }}>
            Configurações salvas com sucesso.
          </div>
        )}

        <p style={{ margin: "0 0 24px", color: "var(--muted)", fontSize: 14 }}>
          Textos e foto exibidos na seção &quot;Quem Somos&quot; da página inicial.
        </p>

        <div className="field" style={{ marginBottom: 20 }}>
          <label htmlFor="qsTag">Tag / etiqueta</label>
          <input id="qsTag" name="qsTag" className="input" defaultValue={settings.qsTag} />
          <div className="hint">Pequena pílula acima do título da seção.</div>
        </div>

        <div className="field" style={{ marginBottom: 20 }}>
          <label htmlFor="qsTitle">Título</label>
          <input id="qsTitle" name="qsTitle" className="input" defaultValue={settings.qsTitle} />
        </div>

        <div className="field" style={{ marginBottom: 20 }}>
          <label htmlFor="qsBody1">Primeiro parágrafo</label>
          <textarea id="qsBody1" name="qsBody1" className="textarea" rows={4} defaultValue={settings.qsBody1} />
        </div>

        <div className="field" style={{ marginBottom: 20 }}>
          <label htmlFor="qsBody2">Segundo parágrafo</label>
          <textarea id="qsBody2" name="qsBody2" className="textarea" rows={4} defaultValue={settings.qsBody2} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16, marginBottom: 16 }}>
          <div className="field">
            <label htmlFor="qsFeature1Title">Destaque 1 — título</label>
            <input id="qsFeature1Title" name="qsFeature1Title" className="input" defaultValue={settings.qsFeature1Title} />
          </div>
          <div className="field">
            <label htmlFor="qsFeature1Desc">Destaque 1 — descrição</label>
            <input id="qsFeature1Desc" name="qsFeature1Desc" className="input" defaultValue={settings.qsFeature1Desc} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16, marginBottom: 24 }}>
          <div className="field">
            <label htmlFor="qsFeature2Title">Destaque 2 — título</label>
            <input id="qsFeature2Title" name="qsFeature2Title" className="input" defaultValue={settings.qsFeature2Title} />
          </div>
          <div className="field">
            <label htmlFor="qsFeature2Desc">Destaque 2 — descrição</label>
            <input id="qsFeature2Desc" name="qsFeature2Desc" className="input" defaultValue={settings.qsFeature2Desc} />
          </div>
        </div>

        <div className="field" style={{ marginBottom: 24 }}>
          <label>Foto da equipe</label>
          <div
            className="dropzone"
            style={{ position: "relative", height: 180, padding: 0, overflow: "hidden", cursor: "pointer" }}
            onClick={() => qsInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); void ingestQs(e.dataTransfer.files?.[0]); }}
          >
            {qsImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qsImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: "var(--muted)", fontSize: 13 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" width={32} height={32}>
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span>Clique ou arraste uma foto aqui</span>
                <span style={{ fontSize: 11 }}>PNG, JPG ou WebP — recomendado 800×600</span>
              </div>
            )}
          </div>
          {qsImage && (
            <button type="button" className="btn" style={{ marginTop: 8, fontSize: 13, color: "var(--muted)" }} onClick={() => setQsImage("")}>
              Remover imagem
            </button>
          )}
          <input ref={qsInputRef} type="file" accept={ACCEPT.join(",")} hidden onChange={(e) => void ingestQs(e.target.files?.[0])} />
          <input type="hidden" name="qsImage" value={qsImage} />
        </div>

        <div className="form-actions">
          <button className="btn btn-primary" type="submit" disabled={pending}>
            {pending ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </div>
    </form>
  );
}
