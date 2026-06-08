"use client";

import { useActionState, useCallback, useRef, useState } from "react";
import type { SiteSettingsData } from "@/core/domain/settings/site-settings";
import {
  updateHeroSettingsAction,
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

export function HeroSettingsForm({ settings }: { settings: SiteSettingsData }) {
  const [state, formAction, pending] = useActionState(updateHeroSettingsAction, initial);
  const [bgImage, setBgImage] = useState<string>(settings.heroBgImage ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  const ingest = useCallback(async (file: File | undefined) => {
    if (!file || !ACCEPT.includes(file.type)) return;
    setBgImage(await fileToDataUrl(file));
  }, []);

  return (
    <form action={formAction} className="panel">
      <div className="panel-head">
        <h2>Cabeçalho da home</h2>
      </div>
      <div className="panel-pad">
        {state.error && <div className="form-error">{state.error}</div>}
        {state.success && (
          <div className="form-error" style={{ background: "#ecfdf5", color: "#047857", borderColor: "#a7f3d0" }}>
            Configurações salvas com sucesso.
          </div>
        )}

        <p style={{ margin: "0 0 24px", color: "var(--muted)", fontSize: 14 }}>
          Edite os textos e a imagem de fundo do banner principal da página inicial.
        </p>

        {/* Imagem de fundo do hero */}
        <div className="field" style={{ marginBottom: 24 }}>
          <label>Imagem de fundo do banner</label>
          <div
            className="dropzone"
            style={{ position: "relative", height: 180, padding: 0, overflow: "hidden", cursor: "pointer" }}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); void ingest(e.dataTransfer.files?.[0]); }}
          >
            {bgImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={bgImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: "var(--muted)", fontSize: 13 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" width={32} height={32}>
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span>Clique ou arraste uma foto aqui</span>
                <span style={{ fontSize: 11 }}>PNG, JPG ou WebP — recomendado 1600×900</span>
              </div>
            )}
          </div>
          {bgImage && (
            <button type="button" className="btn" style={{ marginTop: 8, fontSize: 13, color: "var(--muted)" }} onClick={() => setBgImage("")}>
              Remover imagem
            </button>
          )}
          <input ref={inputRef} type="file" accept={ACCEPT.join(",")} hidden onChange={(e) => void ingest(e.target.files?.[0])} />
          <input type="hidden" name="heroBgImage" value={bgImage} />
          <div className="hint">A imagem aparece escurecida atrás do texto do banner.</div>
        </div>

        <div className="field" style={{ marginBottom: 20 }}>
          <label htmlFor="heroTag">Tag / etiqueta</label>
          <input id="heroTag" name="heroTag" className="input" defaultValue={settings.heroTag} />
          <div className="hint">Pequena pílula verde acima do título.</div>
        </div>

        <div className="field" style={{ marginBottom: 20 }}>
          <label htmlFor="heroTitle">Título principal</label>
          <textarea id="heroTitle" name="heroTitle" className="textarea" rows={2} defaultValue={settings.heroTitle} />
          <div className="hint">Use quebra de linha para dividir em duas linhas.</div>
        </div>

        <div className="field" style={{ marginBottom: 20 }}>
          <label htmlFor="heroDesc">Descrição</label>
          <textarea id="heroDesc" name="heroDesc" className="textarea" rows={3} defaultValue={settings.heroDesc} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          <div className="field">
            <label htmlFor="heroCta1Text">Botão 1 — texto</label>
            <input id="heroCta1Text" name="heroCta1Text" className="input" defaultValue={settings.heroCta1Text} />
          </div>
          <div className="field">
            <label htmlFor="heroCta1Href">Botão 1 — link</label>
            <input id="heroCta1Href" name="heroCta1Href" className="input" defaultValue={settings.heroCta1Href} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
          <div className="field">
            <label htmlFor="heroCta2Text">Botão 2 — texto</label>
            <input id="heroCta2Text" name="heroCta2Text" className="input" defaultValue={settings.heroCta2Text} />
          </div>
          <div className="field">
            <label htmlFor="heroCta2Href">Botão 2 — link</label>
            <input id="heroCta2Href" name="heroCta2Href" className="input" defaultValue={settings.heroCta2Href} />
          </div>
        </div>

        <div style={{ borderTop: "1px solid var(--line)", paddingTop: 20, marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 16px" }}>Estatísticas</h3>
        </div>

        {([
          [1, settings.stat1Num, settings.stat1Label],
          [2, settings.stat2Num, settings.stat2Label],
          [3, settings.stat3Num, settings.stat3Label],
          [4, settings.stat4Num, settings.stat4Label],
        ] as [number, string, string][]).map(([n, num, label]) => (
          <div key={n} style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16, marginBottom: 16 }}>
            <div className="field">
              <label htmlFor={`stat${n}Num`}>Número / valor {n}</label>
              <input id={`stat${n}Num`} name={`stat${n}Num`} className="input" defaultValue={num} />
            </div>
            <div className="field">
              <label htmlFor={`stat${n}Label`}>Legenda {n}</label>
              <input id={`stat${n}Label`} name={`stat${n}Label`} className="input" defaultValue={label} />
            </div>
          </div>
        ))}

        <div className="form-actions">
          <button className="btn btn-primary" type="submit" disabled={pending}>
            {pending ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </div>
    </form>
  );
}
