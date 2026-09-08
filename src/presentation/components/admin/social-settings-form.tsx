"use client";

import { useActionState, useEffect, useState } from "react";
import type { SiteSettingsData } from "@/core/domain/settings/site-settings";
import {
  updateRedesSociaisAction,
  type SettingsFormState,
} from "@/presentation/actions/settings-actions";
import { pushToast } from "./toast";
import { CollapsiblePanel, PanelSummary, PanelSummaryItem } from "./collapsible-panel";

const initial: SettingsFormState = {};

const FIELDS: { name: keyof SiteSettingsData; label: string; placeholder: string }[] = [
  { name: "socialFacebook", label: "Facebook", placeholder: "https://facebook.com/suapagina" },
  { name: "socialInstagram", label: "Instagram", placeholder: "https://instagram.com/seuperfil" },
  { name: "socialTwitter", label: "Twitter / X", placeholder: "https://x.com/seuperfil" },
  { name: "socialLinkedin", label: "LinkedIn", placeholder: "https://linkedin.com/company/suaempresa" },
];

export function SocialSettingsForm({ settings }: { settings: SiteSettingsData }) {
  const [state, formAction, pending] = useActionState(updateRedesSociaisAction, initial);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (state.success) {
      pushToast("Redes sociais salvas com sucesso.", "success");
      setEditing(false);
    }
    if (state.error) pushToast(state.error, "error");
  }, [state]);

  return (
    <CollapsiblePanel
      title="Redes sociais"
      actionLabel="Editar redes sociais"
      open={editing}
      onOpenChange={setEditing}
      summary={
        <PanelSummary>
          <div className="panel-summary-grid">
            {FIELDS.map((f) => (
              <PanelSummaryItem key={f.name} label={f.label} value={(settings[f.name] as string) ?? ""} />
            ))}
          </div>
        </PanelSummary>
      }
    >
      <form action={formAction}>
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
          <button className="btn btn-ghost" type="button" disabled={pending} onClick={() => setEditing(false)}>
            Cancelar
          </button>
          <button className="btn btn-primary" type="submit" disabled={pending}>
            {pending ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </form>
    </CollapsiblePanel>
  );
}
