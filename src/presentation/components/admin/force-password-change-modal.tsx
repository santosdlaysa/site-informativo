"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { UserFormState } from "@/presentation/actions/user-actions";
import { LockIcon } from "../icons";

const EMPTY_STATE: UserFormState = {};

export function ForcePasswordChangeModal() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<UserFormState>(EMPTY_STATE);
  const [pending, setPending] = useState(false);

  async function submitPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setState(EMPTY_STATE);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/me/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: formData.get("currentPassword"),
        newPassword: formData.get("newPassword"),
        confirmPassword: formData.get("confirmPassword"),
      }),
    });
    const result = (await response.json().catch(() => ({}))) as UserFormState;
    setPending(false);

    if (!response.ok) {
      setState({ error: result.error ?? "Não foi possível alterar a senha." });
      return;
    }

    formRef.current?.reset();
    setState({ success: true });
    router.refresh();
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="force-password-title"
      >
        <div className="modal-head">
          <h2 id="force-password-title">Altere sua senha</h2>
        </div>

        <form ref={formRef} onSubmit={submitPassword} className="modal-body modal-body-split">
          <p className="hint" style={{ marginTop: -6 }}>
            Voce entrou com uma senha temporaria. Crie uma nova senha para continuar usando o painel.
          </p>

          {state.error && <div className="form-error">{state.error}</div>}
          {state.success && (
            <div
              className="form-error"
              style={{ background: "#ecfdf5", color: "#047857", borderColor: "#a7f3d0" }}
            >
              Senha alterada com sucesso.
            </div>
          )}

          <div className="field" style={{ marginBottom: 18 }}>
            <label htmlFor="forcedCurrentPassword">Senha atual</label>
            <input
              id="forcedCurrentPassword"
              name="currentPassword"
              className="input"
              type="password"
              autoComplete="current-password"
              required
              autoFocus
            />
          </div>

          <div className="field" style={{ marginBottom: 18 }}>
            <label htmlFor="forcedNewPassword">Nova senha</label>
            <input
              id="forcedNewPassword"
              name="newPassword"
              className="input"
              type="password"
              autoComplete="new-password"
              minLength={6}
              required
            />
            <div className="hint">Use pelo menos 6 caracteres.</div>
          </div>

          <div className="field">
            <label htmlFor="forcedConfirmPassword">Confirmar nova senha</label>
            <input
              id="forcedConfirmPassword"
              name="confirmPassword"
              className="input"
              type="password"
              autoComplete="new-password"
              minLength={6}
              required
            />
          </div>

          <div className="form-actions">
            <button className="btn btn-primary" type="submit" disabled={pending}>
              <LockIcon />
              {pending ? "Alterando..." : "Alterar senha"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
