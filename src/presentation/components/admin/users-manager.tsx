"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { UserListItem, UserProfile } from "@/core/domain/user/user.repository";
import {
  createUserAction,
  deleteUserAction,
  type UserFormState,
} from "@/presentation/actions/user-actions";
import { TrashIcon, PlusIcon, LockIcon, UsersIcon } from "../icons";
import { pushToast } from "./toast";

const MAX_USERS = 3;
const INITIAL: UserFormState = {};
const FALLBACK_BIO =
  "Editor do Raros Boa Vista. Escreve sobre desenvolvimento web, performance e boas práticas.";
const ACCEPT = ["image/png", "image/jpeg", "image/webp", "image/avif"];
const EMPTY_MODAL_STATE: UserFormState = {};

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

export function UsersManager({
  users,
  currentUserId,
  currentProfile,
}: {
  users: UserListItem[];
  currentUserId: string;
  currentProfile: UserProfile;
}) {
  const [state, formAction, pending] = useActionState(createUserAction, INITIAL);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const router = useRouter();
  const canAdd = users.length < MAX_USERS;
  const currentUser = users.find((u) => u.id === currentUserId) ?? null;
  const currentUserForModal: UserListItem = currentUser ?? {
    id: currentProfile.id,
    name: currentProfile.name,
    email: currentProfile.email,
    createdAt: new Date(),
  };

  async function handleDelete(id: string) {
    setDeletingId(id);
    const result = await deleteUserAction(id);
    setDeletingId(null);
    if (result.error) {
      pushToast(result.error, "error");
      return;
    }
    pushToast("Editor removido com sucesso.", "success");
    router.refresh();
  }

  useEffect(() => {
    if (state.success) pushToast("Editor criado com sucesso.", "success");
    if (state.error) pushToast(state.error, "error");
    if (state.success) router.refresh();
  }, [state, router]);

  return (
    <div className="stack">
      <div className="panel panel-pad editor-profile-card">
        <div className="profile-summary" style={{ marginBottom: 0 }}>
          <div className="profile-avatar">
            {currentProfile.avatar && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={currentProfile.avatar} alt="" />
            )}
          </div>
          <div>
            <h3>{currentProfile.name}</h3>
            <p>{currentProfile.bio?.trim() || FALLBACK_BIO}</p>
          </div>
        </div>
        <button className="btn btn-primary" type="button" onClick={() => setProfileModalOpen(true)}>
          <UsersIcon />
          Abrir perfil
        </button>
      </div>

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
            {users.map((u) => {
              const isCurrentUser = u.id === currentUserId;
              return (
                <tr key={u.id}>
                  <td>
                    <div className="t-title">{u.name}</div>
                    {isCurrentUser && (
                      <div className="t-sub">você</div>
                    )}
                  </td>
                  <td>{u.email}</td>
                  <td>{new Date(u.createdAt).toLocaleDateString("pt-BR")}</td>
                  <td>
                    {isCurrentUser ? (
                      <div className="act-inline">
                        <button
                          title="Ver perfil"
                          onClick={() => setProfileModalOpen(true)}
                        >
                          <UsersIcon />
                        </button>
                      </div>
                    ) : (
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
              );
            })}
          </tbody>
        </table>
      </div>

      {canAdd && (
        <div className="panel panel-pad">
          <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 20 }}>Adicionar editor</h2>

          {state.error && <div className="form-error">{state.error}</div>}
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
              <input className="input" name="password" type="password" placeholder="Mínimo 6 caracteres ou teste" required />
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

      {profileModalOpen && (
        <ProfileModal
          user={currentUserForModal}
          profile={currentProfile}
          onClose={() => setProfileModalOpen(false)}
        />
      )}
    </div>
  );
}

function ProfileModal({
  user,
  profile,
  onClose,
}: {
  user: UserListItem;
  profile: UserProfile;
  onClose: () => void;
}) {
  const [passwordState, setPasswordState] = useState<UserFormState>(EMPTY_MODAL_STATE);
  const [profileState, setProfileState] = useState<UserFormState>(EMPTY_MODAL_STATE);
  const [passwordPending, setPasswordPending] = useState(false);
  const [profilePending, setProfilePending] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio ?? "");
  const [avatar, setAvatar] = useState(profile.avatar ?? "");
  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (profileState.success) router.refresh();
  }, [profileState.success, router]);

  async function ingest(file: File | undefined) {
    if (!file || !ACCEPT.includes(file.type)) return;
    setAvatar(await fileToDataUrl(file));
  }

  async function submitProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProfilePending(true);
    setProfileState(EMPTY_MODAL_STATE);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/me/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        bio: formData.get("bio") ?? "",
        avatar: formData.get("avatar") ?? "",
      }),
    });
    const result = (await response.json().catch(() => ({}))) as UserFormState;
    setProfilePending(false);
    if (!response.ok) {
      setProfileState({ error: result.error ?? "Não foi possível salvar o perfil." });
      pushToast(result.error ?? "Não foi possível salvar o perfil.", "error");
      return;
    }
    setProfileState({ success: true });
    pushToast("Perfil atualizado com sucesso.", "success");
    router.refresh();
    onClose();
  }

  async function submitPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordPending(true);
    setPasswordState(EMPTY_MODAL_STATE);

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
    setPasswordPending(false);
    if (!response.ok) {
      setPasswordState({ error: result.error ?? "Não foi possível alterar a senha." });
      pushToast(result.error ?? "Não foi possível alterar a senha.", "error");
      return;
    }
    setPasswordState({ success: true });
    pushToast("Senha alterada com sucesso.", "success");
    formRef.current?.reset();
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <h2 id="profile-modal-title">Perfil do editor</h2>
          <button type="button" className="modal-close" aria-label="Fechar" onClick={onClose}>
            ×
          </button>
        </div>

        {!editingProfile && (
          <div className="modal-body">
            <div className="profile-summary">
              <div className="profile-avatar">
                {avatar && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatar} alt="" />
                )}
              </div>
              <div>
                <h3>{name}</h3>
                <p>{bio.trim() || FALLBACK_BIO}</p>
              </div>
            </div>

            <div className="profile-details">
              <div>
                <span>E-mail</span>
                <strong>{user.email}</strong>
              </div>
              <div>
                <span>Criado em</span>
                <strong>{new Date(user.createdAt).toLocaleDateString("pt-BR")}</strong>
              </div>
            </div>

            {!editingPassword && (
              <div className="form-actions">
                <button className="btn btn-ghost" type="button" onClick={() => setEditingProfile(true)}>
                  <UsersIcon />
                  Editar foto e texto
                </button>
              <button className="btn btn-primary" type="button" onClick={() => setEditingPassword(true)}>
                <LockIcon />
                Editar senha
              </button>
              </div>
            )}
          </div>
        )}

        {editingProfile && (
          <form onSubmit={submitProfile} className="modal-body modal-body-split">
            {profileState.error && <div className="form-error">{profileState.error}</div>}
            <div className="field" style={{ marginBottom: 18 }}>
              <label>Foto do autor</label>
              <div className="profile-photo-edit">
                <div className="profile-avatar">
                  {avatar && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatar} alt="" />
                  )}
                </div>
                <div>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => fileRef.current?.click()}>
                    {avatar ? "Trocar foto" : "Enviar foto"}
                  </button>
                  {avatar && (
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => setAvatar("")}>
                      Remover
                    </button>
                  )}
                </div>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept={ACCEPT.join(",")}
                hidden
                onChange={(e) => void ingest(e.target.files?.[0])}
              />
              <input type="hidden" name="avatar" value={avatar} />
            </div>

            <div className="field" style={{ marginBottom: 18 }}>
              <label htmlFor="authorName">Nome de exibição</label>
              <input
                id="authorName"
                name="name"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="authorBio">Texto do perfil</label>
              <textarea
                id="authorBio"
                name="bio"
                className="textarea"
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <div className="form-actions">
              <button className="btn btn-ghost" type="button" onClick={() => setEditingProfile(false)}>
                Voltar
              </button>
              <button className="btn btn-primary" type="submit" disabled={profilePending}>
                {profilePending ? "Salvando..." : "Salvar perfil"}
              </button>
            </div>
          </form>
        )}

        {editingPassword && (
        <form ref={formRef} onSubmit={submitPassword} className="modal-body modal-body-split">
          {passwordState.error && <div className="form-error">{passwordState.error}</div>}
          <div className="field" style={{ marginBottom: 18 }}>
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

          <div className="field" style={{ marginBottom: 18 }}>
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
            <button className="btn btn-ghost" type="button" onClick={onClose}>
              Cancelar
            </button>
            <button className="btn btn-primary" type="submit" disabled={passwordPending}>
              <LockIcon />
              {passwordPending ? "Alterando..." : "Alterar senha"}
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
}
