"use client";

import Image from "next/image";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { USER_ROLE_LABEL, type UserRole } from "@/core/domain/user/user-role";
import {
  createUserAction,
  deleteAnyUserAction,
  updateUserCompaniesAction,
  type UserFormState,
} from "@/presentation/actions/user-actions";
import { CollapsiblePanel } from "./collapsible-panel";
import { pushToast } from "./toast";
import { PlusIcon, TrashIcon } from "../icons";
import favicon from "@/assets/Favicon.png";

export type ManagedUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId: string;
  companyIds: string[];
  createdAt: string;
};

export type ManagedCompany = { id: string; name: string; slug: string; logo?: string | null };

const INITIAL: UserFormState = {};

/**
 * Switch de sites: cada site é um botão que liga/desliga o acesso.
 * O usuário pode acessar um, vários ou todos os sites.
 */
function CompanySwitch({
  companies,
  value,
  onChange,
  name,
  disabled = false,
  size = "md",
}: {
  companies: ManagedCompany[];
  value: string[];
  onChange: (companyIds: string[]) => void;
  name?: string;
  disabled?: boolean;
  size?: "md" | "sm";
}) {
  function toggle(companyId: string) {
    const next = value.includes(companyId)
      ? value.filter((id) => id !== companyId)
      : [...value, companyId];
    // Pelo menos um site precisa continuar marcado.
    if (next.length === 0) return;
    onChange(companies.filter((company) => next.includes(company.id)).map((company) => company.id));
  }

  return (
    <div className={`site-switch${size === "sm" ? " site-switch--sm" : ""}`} role="group">
      {name && value.map((companyId) => <input key={companyId} type="hidden" name={name} value={companyId} />)}
      {companies.map((company) => {
        const active = value.includes(company.id);
        return (
          <button
            key={company.id}
            type="button"
            className={active ? "is-active" : ""}
            disabled={disabled}
            aria-pressed={active}
            onClick={() => toggle(company.id)}
          >
            <span className="site-switch-logo">
              <Image src={company.logo || favicon} alt="" width={18} height={18} unoptimized={!!company.logo} />
            </span>
            {company.name}
            {active && <span className="site-switch-check" aria-hidden="true">✓</span>}
          </button>
        );
      })}
    </div>
  );
}

export function AdminUsersManager({
  users,
  companies,
  currentUserId,
}: {
  users: ManagedUser[];
  companies: ManagedCompany[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(createUserAction, INITIAL);
  const [creating, setCreating] = useState(false);
  const [newUserCompanyIds, setNewUserCompanyIds] = useState<string[]>(companies[0] ? [companies[0].id] : []);
  const [savingUserId, setSavingUserId] = useState<string | null>(null);

  useEffect(() => {
    if (state.success) {
      pushToast("Usuário criado com sucesso.", "success");
      setCreating(false);
      router.refresh();
    }
    if (state.error) pushToast(state.error, "error");
  }, [state, router]);

  async function changeCompanies(user: ManagedUser, companyIds: string[]) {
    setSavingUserId(user.id);
    const result = await updateUserCompaniesAction(user.id, companyIds);
    setSavingUserId(null);
    if (result.error) {
      pushToast(result.error, "error");
      router.refresh();
      return;
    }
    pushToast("Sites do usuário atualizados.", "success");
    router.refresh();
  }

  async function removeUser(user: ManagedUser) {
    if (!confirm(`Remover o acesso de ${user.name}?`)) return;
    setSavingUserId(user.id);
    const result = await deleteAnyUserAction(user.id);
    setSavingUserId(null);
    if (result.error) {
      pushToast(result.error, "error");
      return;
    }
    pushToast("Usuário removido com sucesso.", "success");
    router.refresh();
  }

  return (
    <div className="stack">
      <CollapsiblePanel
        title="Novo usuário"
        actionLabel="Adicionar usuário"
        actionIcon="plus"
        open={creating}
        onOpenChange={setCreating}
        style={{ marginBottom: 28 }}
      >
        {state.error && <div className="form-error">{state.error}</div>}
        <form action={formAction}>
          <div className="field" style={{ marginBottom: 18 }}>
            <label>Sites que este usuário acessa</label>
            <CompanySwitch
              companies={companies}
              value={newUserCompanyIds}
              onChange={setNewUserCompanyIds}
              name="companyIds"
              disabled={pending}
            />
            <div className="hint">Marque um ou mais sites. Administradores acessam todos, independentemente da escolha.</div>
          </div>

          <div className="row-2" style={{ marginBottom: 18 }}>
            <div className="field">
              <label htmlFor="new-user-name">Nome</label>
              <input id="new-user-name" className="input" name="name" placeholder="Nome completo" required />
            </div>
            <div className="field">
              <label htmlFor="new-user-email">E-mail</label>
              <input id="new-user-email" className="input" name="email" type="email" placeholder="usuario@exemplo.com" required />
            </div>
          </div>

          <div className="row-2" style={{ marginBottom: 20 }}>
            <div className="field">
              <label htmlFor="new-user-role">Permissão</label>
              <div className="selnative">
                <select id="new-user-role" className="select" name="role" defaultValue="editor">
                  <option value="admin">Administrador (acessa todos os sites)</option>
                  <option value="editor">Pode editar apenas os próprios posts</option>
                  <option value="viewer">Apenas visualizar</option>
                </select>
                <svg className="chev" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </div>
            <div className="field">
              <label htmlFor="new-user-password">Senha</label>
              <input id="new-user-password" className="input" name="password" type="password" placeholder="Mínimo 6 caracteres ou teste" required />
            </div>
          </div>

          <div className="form-actions" style={{ marginTop: 0 }}>
            <button className="btn btn-ghost" type="button" disabled={pending} onClick={() => setCreating(false)}>
              Cancelar
            </button>
            <button className="btn btn-primary" type="submit" disabled={pending}>
              <PlusIcon />
              {pending ? "Criando..." : "Criar usuário"}
            </button>
          </div>
        </form>
      </CollapsiblePanel>

      <div className="panel">
        <div className="panel-head">
          <h2>Usuários cadastrados</h2>
          <span className="count">{users.length} {users.length === 1 ? "usuário" : "usuários"}</span>
        </div>
        <table className="tbl users-site-table">
          <thead>
            <tr>
              <th>Usuário</th>
              <th>Permissão</th>
              <th>Sites que acessa</th>
              <th>Criado em</th>
              <th style={{ width: 64 }}><span className="sr-only">Ações</span></th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr className="empty-row">
                <td colSpan={5}>Nenhum usuário cadastrado.</td>
              </tr>
            ) : users.map((user) => {
              const isCurrentUser = user.id === currentUserId;
              return (
                <tr key={user.id}>
                  <td>
                    <div className="t-title">
                      {user.name}
                      <div className="t-sub">{user.email}{isCurrentUser ? " · você" : ""}</div>
                    </div>
                  </td>
                  <td>{USER_ROLE_LABEL[user.role]}</td>
                  <td>
                    <CompanySwitch
                      companies={companies}
                      value={user.companyIds}
                      onChange={(companyIds) => void changeCompanies(user, companyIds)}
                      disabled={isCurrentUser || savingUserId === user.id}
                      size="sm"
                    />
                    {isCurrentUser && <div className="t-sub">Não é possível mudar os seus próprios sites.</div>}
                    {user.role === "admin" && !isCurrentUser && <div className="t-sub">Administrador acessa todos os sites.</div>}
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString("pt-BR")}</td>
                  <td className="act-cell">
                    <div className="act-inline">
                      {!isCurrentUser && (
                        <button
                          type="button"
                          className="danger"
                          title="Remover usuário"
                          aria-label={`Remover ${user.name}`}
                          disabled={savingUserId === user.id}
                          onClick={() => void removeUser(user)}
                        >
                          <TrashIcon />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
