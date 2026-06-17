"use client";

import Image from "next/image";
import { useActionState, useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginAction, type LoginState } from "@/presentation/actions/auth-actions";
import { EyeIcon } from "../icons";
import logoHorizontal from "@/assets/Logo horizontal.png";

const initial: LoginState = {};

export function LoginForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(loginAction, initial);
  const [showPass, setShowPass] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  // Redireciona automaticamente após login bem-sucedido
  useEffect(() => {
    if (state.success) {
      // Limpa campos sensíveis antes de redirecionar
      if (emailInputRef.current) emailInputRef.current.value = "";
      if (passwordInputRef.current) passwordInputRef.current.value = "";

      // Aguarda um frame para garantir que os campos foram limpos
      requestAnimationFrame(() => {
        router.push("/admin/posts");
      });
    }
  }, [state.success, router]);

  return (
    <div className="auth-screen auth-center">
      <form className="login-card" action={formAction} autoComplete="off">
        <div className="login-logo">
          <Image
            className="brand-logo"
            src={logoHorizontal}
            alt="Raros Boa Vista"
            priority
            height={40}
          />
        </div>

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
            <input
              ref={emailInputRef}
              id="email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              required
              autoComplete="off"
              disabled={pending}
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
              disabled={pending}
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

        <button className="btn btn-primary btn-block" type="submit" disabled={pending} style={{ marginTop: 6 }}>
          {pending ? "Entrando..." : "Entrar no painel"}
        </button>
      </form>
    </div>
  );
}
