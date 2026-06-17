"use client";

import { useActionState, useEffect } from "react";
import type { SiteSettingsData } from "@/core/domain/settings/site-settings";
import {
  updateRedesSociaisAction,
  type SettingsFormState,
} from "@/presentation/actions/settings-actions";
import { pushToast } from "./toast";

const initial: SettingsFormState = {};

const FIELDS: { name: keyof SiteSettingsData; label: string; placeholder: string }[] = [
  { name: "socialFacebook", label: "Facebook", placeholder: "https://facebook.com/suapagina" },
  { name: "socialInstagram", label: "Instagram", placeholder: "https://instagram.com/seuperfil" },
  { name: "socialTwitter", label: "Twitter / X", placeholder: "https://x.com/seuperfil" },
  { name: "socialLinkedin", label: "LinkedIn", placeholder: "https://linkedin.com/company/suaempresa" },
];

export function SocialSettingsForm({ settings }: { settings: SiteSettingsData }) {
  const [state, formAction, pending] = useActionState(updateRedesSociaisAction, initial);

  useEffect(() => {
    if (state.success) pushToast("Redes sociais salvas com sucesso.", "success");
    if (state.error) pushToast(state.error, "error");
  }, [state]);

  return (
    <form action={formAction} className="panel">
      <div className="panel-head">
        <h2>Redes sociais</h2>
      </div>
      <div className="panel-pad">
        {state.error && <div className="form-error">{state.error}</div>}
        <p style={{ margin: "0 0 24px", color: "var(--muted)", fontSize: 14 }}>
          Cadastre os links das redes sociais exibidas no rodapé do site. Deixe em branco para ocultar o ícone.
        </p>

        {FIELDS.map((f) => (
          <div key={f.name} className="field" style={{ marginBottom: 20 }}>
            <label htmlFor={f.name}>{f.label}</label>
            <input
              id={f.name}
              name={f.name}
              type="url"
              className="input"
              placeholder={f.placeholder}
              defaultValue={(settings[f.name] as string) ?? ""}
            />
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
