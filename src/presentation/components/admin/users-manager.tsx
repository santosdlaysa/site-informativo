"use client";

import { useActionState, useState } from "react";
import type { UserListItem } from "@/core/domain/user/user.repository";
import { createUserAction, deleteUserAction, UserFormState } from "@/presentation/actions/user-actions";
import { TrashIcon, PlusIcon } from "../icons";

const MAX_USERS = 3;
const INITIAL: UserFormState = {};

export function UsersManager({
  users,
  currentUserId,
}: {
  users: UserListItem[];
  currentUserId: string;
}) {
  const [state, formAction, pending] = useActionState(createUserAction, INITIAL);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const canAdd = users.length < MAX_USERS;

  async function handleDelete(id: string) {
    setDeletingId(id);
    await deleteUserAction(id);
    setDeletingId(null);
  }

  return (
    <div className="stack">
      <div className="panel">
        <div className="panel-head">
          <h2>Editores cadastrados</h2>
          <span className="count">{users.length} / {MAX_USERS}</span>
        </div>

        <table className="tbl">
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Criado em</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="empty-row">Nenhum editor cadastrado.</td>
              </tr>
            )}
            {users.map((u) => (
              <tr key={u.id}>
                <td>
                  <div className="t-title">{u.name}</div>
                  {u.id === currentUserId && (
                    <div className="t-sub">você</div>
                  )}
                </td>
                <td>{u.email}</td>
                <td>{new Date(u.createdAt).toLocaleDateString("pt-BR")}</td>
                <td>
                  {u.id !== currentUserId && (
                    <div className="act-inline">
                      <button
                        className="danger"
                        title="Remover editor"
                        disabled={deletingId === u.id}
                        onClick={() => handleDelete(u.id)}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {canAdd && (
        <div className="panel panel-pad">
          <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 20 }}>Adicionar editor</h2>

          {state.error && <div className="form-error">{state.error}</div>}
          {state.success && (
            <div style={{ background: "#dcfce7", border: "1px solid #86efac", color: "#16a34a", fontSize: 13.5, padding: "10px 13px", borderRadius: 9, marginBottom: 18 }}>
              Editor criado com sucesso.
            </div>
          )}

          <form action={formAction}>
            <div className="row-2" style={{ marginBottom: 18 }}>
              <div className="field">
                <label>Nome</label>
                <input className="input" name="name" placeholder="Nome completo" required />
              </div>
              <div className="field">
                <label>E-mail</label>
                <input className="input" name="email" type="email" placeholder="editor@exemplo.com" required />
              </div>
            </div>
            <div className="field" style={{ marginBottom: 20 }}>
              <label>Senha</label>
              <input className="input" name="password" type="password" placeholder="Mínimo 6 caracteres" required minLength={6} />
            </div>
            <div className="form-actions" style={{ marginTop: 0 }}>
              <button className="btn btn-primary" type="submit" disabled={pending}>
                <PlusIcon />
                {pending ? "Criando..." : "Criar editor"}
              </button>
            </div>
          </form>
        </div>
      )}

      {!canAdd && (
        <div className="panel panel-pad" style={{ color: "#6b7280", fontSize: 14, textAlign: "center" }}>
          Limite de {MAX_USERS} editores atingido. Remova um para adicionar outro.
        </div>
      )}
    </div>
  );
}
