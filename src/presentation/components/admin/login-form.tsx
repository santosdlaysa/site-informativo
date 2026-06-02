"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { loginAction, type LoginState } from "@/presentation/actions/auth-actions";
import { ShieldIcon, EyeIcon } from "../icons";

const initial: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initial);
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="auth-screen">
      <div className="auth">
        <div className="brandside">
          <div className="logo">
            <span className="mark">
              <ShieldIcon width={20} height={20} stroke="#fff" />
            </span>
            MeuBlog
          </div>
          <div className="pitch">
            <h2>Bem-vindo de volta ao painel do MeuBlog</h2>
            <p>
              Gerencie posts, programação e eventos do seu blog em um só lugar, de forma simples e
              rápida.
            </p>
          </div>
          <div className="feats">
            <div>
              <CheckIcon /> Publicação rápida e fácil
            </div>
            <div>
              <CheckIcon /> Controle de rascunhos e publicações
            </div>
            <div>
              <CheckIcon /> Painel seguro e responsivo
            </div>
          </div>
        </div>

        <div className="formside">
          <form className="login-card" action={formAction}>
            <h1>Entrar</h1>
            <p className="sub">Acesse o painel administrativo</p>

            {state.error && <div className="form-error">{state.error}</div>}

            <div className="field">
              <label htmlFor="email">E-mail</label>
              <div className="inputwrap">
                <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
                <input id="email" name="email" type="email" placeholder="admin@meublog.com" defaultValue="admin@meublog.com" required />
              </div>
            </div>

            <div className="field">
              <label htmlFor="senha">Senha</label>
              <div className="inputwrap">
                <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="11" width="16" height="10" rx="2" />
                  <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                </svg>
                <input
                  id="senha"
                  name="password"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="eye"
                  aria-label="Mostrar senha"
                  onClick={() => setShowPass((v) => !v)}
                  style={{ color: showPass ? "#2563eb" : undefined }}
                >
                  <EyeIcon width={18} height={18} />
                </button>
              </div>
            </div>

            <div className="row-between">
              <label className="check">
                <input type="checkbox" defaultChecked /> Manter conectado
              </label>
              <a className="forgot" href="#">
                Esqueceu a senha?
              </a>
            </div>

            <button className="btn btn-primary btn-block" type="submit" disabled={pending}>
              {pending ? "Entrando..." : "Entrar no painel"}
            </button>

            <div className="divider">ou</div>
            <Link className="btn btn-ghost btn-block" href="/">
              Voltar ao site
            </Link>

            <p className="signup-note">
              Não tem acesso? <a href="#">Solicite ao administrador</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="m20 6-11 11-5-5" />
    </svg>
  );
}
