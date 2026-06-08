"use client";

import { useActionState, useCallback, useRef, useState } from "react";
import type { UserProfile } from "@/core/domain/user/user.repository";
import {
  updateProfileAction,
  type ProfileFormState,
} from "@/presentation/actions/profile-actions";

const initial: ProfileFormState = {};

const FALLBACK_BIO =
  "Editor do Raros Boa Vista. Escreve sobre desenvolvimento web, performance e boas práticas.";

const ACCEPT = ["image/png", "image/jpeg", "image/webp", "image/avif"];

async function fileToDataUrl(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const size = 200;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const scale = Math.max(size / bitmap.width, size / bitmap.height);
  const w = bitmap.width * scale;
  const h = bitmap.height * scale;
  ctx.drawImage(bitmap, (size - w) / 2, (size - h) / 2, w, h);
  bitmap.close?.();
  return canvas.toDataURL("image/webp", 0.85);
}

export function ProfileForm({ profile }: { profile: UserProfile }) {
  const [state, formAction, pending] = useActionState(updateProfileAction, initial);
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio ?? "");
  const [avatar, setAvatar] = useState<string>(profile.avatar ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  const ingest = useCallback(async (file: File | undefined) => {
    if (!file || !ACCEPT.includes(file.type)) return;
    setAvatar(await fileToDataUrl(file));
  }, []);

  return (
    <div className="form-grid">
      <form action={formAction} className="panel">
        <div className="panel-head">
          <h2>Perfil do autor</h2>
        </div>
        <div className="panel-pad">
          {state.error && <div className="form-error">{state.error}</div>}
          {state.success && (
            <div
              className="form-error"
              style={{
                background: "#ecfdf5",
                color: "#047857",
                borderColor: "#a7f3d0",
              }}
            >
              Perfil atualizado com sucesso.
            </div>
          )}

          <div className="field" style={{ marginBottom: 22 }}>
            <label>Foto do autor</label>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: "#cbd5e1",
                  overflow: "hidden",
                  flex: "none",
                  cursor: "pointer",
                  border: "2px dashed var(--line)",
                }}
                onClick={() => inputRef.current?.click()}
              >
                {avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", fontSize: 11, textAlign: "center", padding: 4 }}>
                    Clique para enviar
                  </div>
                )}
              </div>
              <div>
                <button type="button" className="btn" onClick={() => inputRef.current?.click()}>
                  {avatar ? "Trocar foto" : "Enviar foto"}
                </button>
                {avatar && (
                  <button type="button" className="btn" style={{ marginLeft: 8, color: "var(--muted)" }} onClick={() => setAvatar("")}>
                    Remover
                  </button>
                )}
                <div className="hint" style={{ marginTop: 6 }}>PNG, JPG ou WebP. Será recortado em círculo.</div>
              </div>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPT.join(",")}
              hidden
              onChange={(e) => void ingest(e.target.files?.[0])}
            />
            <input type="hidden" name="avatar" value={avatar} />
          </div>

          <div className="field" style={{ marginBottom: 22 }}>
            <label htmlFor="name">Nome de exibição</label>
            <input
              id="name"
              name="name"
              className="input"
              type="text"
              placeholder="Como seu nome aparece nos posts"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <div className="hint">Aparece em “por …” e no rodapé de cada post.</div>
          </div>

          <div className="field" style={{ marginBottom: 22 }}>
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              className="textarea"
              rows={4}
              placeholder="Uma breve descrição do autor (aparece no rodapé do post)"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            <div className="hint">
              Se ficar em branco, usamos um texto padrão.
            </div>
          </div>

          <div className="field">
            <label htmlFor="email">E-mail de acesso</label>
            <input
              id="email"
              className="input"
              type="email"
              value={profile.email}
              disabled
              style={{ background: "#f6f7f9", color: "var(--muted)", cursor: "not-allowed" }}
            />
            <div className="hint">O e-mail de login não é alterado por aqui.</div>
          </div>

          <div className="form-actions">
            <button className="btn btn-primary" type="submit" disabled={pending}>
              {pending ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        </div>
      </form>

      <div className="stack">
        <div className="panel">
          <div className="panel-head">
            <h2>Pré-visualização</h2>
            <span className="count">no rodapé do post</span>
          </div>
          <div className="panel-pad">
            <div
              style={{
                display: "flex",
                gap: 16,
                alignItems: "center",
                background: "#fff",
                border: "1px solid var(--line)",
                borderRadius: 14,
                padding: 22,
              }}
            >
              <div
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: "50%",
                  background: "#cbd5e1",
                  flex: "none",
                  overflow: "hidden",
                }}
              >
                {avatar && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                )}
              </div>
              <div>
                <h4 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>
                  {name.trim() || "Nome do autor"}
                </h4>
                <p style={{ margin: "4px 0 0", color: "var(--muted)", fontSize: 14 }}>
                  {bio.trim() || FALLBACK_BIO}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
