"use client";

import Image from "next/image";
import { useActionState, useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginAction, type LoginState } from "@/presentation/actions/auth-actions";
import { EyeIcon } from "../icons";

const initial: LoginState = {};

export type LoginCompany = { id: string; name: string; slug: string; logo?: string | null };

export function LoginForm({ company }: { company?: LoginCompany | null }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(loginAction, initial);
  const [showPass, setShowPass] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const loading = pending || redirecting;

  // Redireciona automaticamente após login bem-sucedido
  useEffect(() => {
    if (state.success) {
      setRedirecting(true);
      // Limpa campos sensíveis antes de redirecionar
      if (emailInputRef.current) emailInputRef.current.value = "";
      if (passwordInputRef.current) passwordInputRef.current.value = "";

      // Aguarda um frame para garantir que os campos foram limpos
      requestAnimationFrame(() => {
        router.replace(state.redirectTo ?? "/admin/posts");
        router.refresh();
      });
    }
  }, [state.success, state.redirectTo, router]);

  return (
    <div className="auth-screen auth-center">
      <div className="login-stack">
        <div className="login-brand">
          <Image src="/movie-sidebar-logo.png" alt="Movie" width={6000} height={6000} priority />
        </div>
        <form className="login-card" action={formAction} autoComplete="off" aria-busy={loading}>
          {company && (
            <>
              <input type="hidden" name="companySlug" value={company.slug} />
              <div className="login-company">
                {company.logo && (
                  <span className="login-company-logo">
                    <Image src={company.logo} alt="" width={26} height={26} unoptimized />
                  </span>
                )}
                <span>{company.name}</span>
              </div>
            </>
          )}

          <h1>Entrar</h1>
          <p className="sub">
            {company ? `Acesse o painel do ${company.name}` : "Acesse o painel administrativo"}
          </p>

          {state.error && <div className="form-error">{state.error}</div>}

          <div className="field">
            <label htmlFor="email">E-mail</label>
            <div className="inputwrap">
              <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
              <input
                ref={emailInputRef}
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                required
                autoComplete="off"
                disabled={loading}
              />
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
                ref={passwordInputRef}
                id="senha"
                name="password"
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                required
                autoComplete="off"
                disabled={loading}
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

          <button className="btn btn-primary btn-block" type="submit" disabled={loading} style={{ marginTop: 6 }}>
            {loading ? "Entrando..." : "Entrar no painel"}
          </button>
        </form>
      </div>
      {loading && (
        <div className="company-loading-overlay" role="status" aria-live="assertive" aria-label="Entrando no painel">
          <div className="company-loading-card">
            <span className="company-loading-spinner" aria-hidden="true" />
            <strong>Entrando no painel</strong>
            <span>Aguarde enquanto preparamos seu acesso.</span>
          </div>
        </div>
      )}
    </div>
  );
}
