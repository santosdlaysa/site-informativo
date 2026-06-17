"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  updateOwnPasswordAction,
  type UserFormState,
} from "@/presentation/actions/user-actions";
import { LockIcon } from "../icons";

const initial: UserFormState = {};

export function PasswordSettingsForm() {
  const [state, formAction, pending] = useActionState(updateOwnPasswordAction, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} className="panel">
      <div className="panel-head">
        <h2>Alterar senha</h2>
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
            Senha alterada com sucesso.
          </div>
        )}

        <div className="row-2" style={{ marginBottom: 18 }}>
          <div className="field">
            <label htmlFor="currentPassword">Senha atual</label>
            <input
              id="currentPassword"
              name="currentPassword"
              className="input"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="newPassword">Nova senha</label>
            <input
              id="newPassword"
              name="newPassword"
              className="input"
              type="password"
              autoComplete="new-password"
              minLength={6}
              required
            />
            <div className="hint">Use pelo menos 6 caracteres.</div>
          </div>
        </div>

        <div className="field">
          <label htmlFor="confirmPassword">Confirmar nova senha</label>
          <input
            id="confirmPassword"
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
      </div>
    </form>
  );
}
