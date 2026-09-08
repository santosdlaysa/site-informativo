"use client";

import { useActionState, useEffect } from "react";
import type { SiteSettingsData } from "@/core/domain/settings/site-settings";
import {
  updateContactSettingsAction,
  type SettingsFormState,
} from "@/presentation/actions/settings-actions";
import { pushToast } from "./toast";

const initial: SettingsFormState = {};

export function ContactSettingsForm({ settings }: { settings: SiteSettingsData }) {
  const [state, formAction, pending] = useActionState(updateContactSettingsAction, initial);

  useEffect(() => {
    if (state.success) pushToast("Dados de contato salvos com sucesso.", "success");
    if (state.error) pushToast(state.error, "error");
  }, [state]);

  return (
    <form action={formAction} className="panel">
      <div className="panel-head">
        <h2>Contato</h2>
      </div>
      <div className="panel-pad">
        {state.error && <div className="form-error">{state.error}</div>}
        <p style={{ margin: "0 0 24px", color: "var(--muted)", fontSize: 14 }}>
          Informe o e-mail e o telefone exibidos no rodapé. Deixe um campo em branco para ocultá-lo.
        </p>

        <div className="field" style={{ marginBottom: 20 }}>
          <label htmlFor="contactEmail">E-mail</label>
          <input
            id="contactEmail"
            name="contactEmail"
            type="email"
            className="input"
            placeholder="contato@exemplo.com"
            defaultValue={settings.contactEmail}
          />
        </div>

        <div className="field" style={{ marginBottom: 20 }}>
          <label htmlFor="contactPhone">Telefone</label>
          <input
            id="contactPhone"
            name="contactPhone"
            type="tel"
            className="input"
            placeholder="(95) 99999-9999"
            defaultValue={settings.contactPhone}
          />
        </div>

        <div className="form-actions">
          <button className="btn btn-primary" type="submit" disabled={pending}>
            {pending ? "Salvando..." : "Salvar contato"}
          </button>
        </div>
      </div>
    </form>
  );
}
