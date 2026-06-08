"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { SearchIcon } from "../icons";
import logoHorizontal from "@/assets/Logo horizontal.png";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/acoes", label: "Ações" },
  { href: "/posts", label: "Posts" },
  { href: "/programacao", label: "Programação" },
  { href: "/eventos", label: "Eventos" },
];

export function SiteHeader({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Foca o campo assim que ele é exibido.
  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  // Fecha o menu mobile ao navegar para outra página.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!searchOpen) {
      setSearchOpen(true);
      return;
    }
    const term = inputRef.current?.value.trim() ?? "";
    router.push(term ? `/posts?busca=${encodeURIComponent(term)}` : "/posts");
  }

  return (
    <header className="site-header">
      <div className="wrap nav">
        <Link className="brand" href="/" aria-label="Raros Boa Vista — início">
          <Image
            className="brand-logo"
            src={logoHorizontal}
            alt="Raros Boa Vista"
            priority
            height={38}
          />
        </Link>
        <ul className="menu">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link className={isActive(l.href) ? "active" : ""} href={l.href}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href={isLoggedIn ? "/admin" : "/admin/login"}
          className="nav-login"
        >
          {isLoggedIn ? "Painel" : "Entrar"}
        </Link>
        <form className="header-search" onSubmit={handleSubmit}>
          {searchOpen && (
            <input
              ref={inputRef}
              type="search"
              name="busca"
              placeholder="Buscar posts..."
              className="header-search-input"
              onBlur={(e) => {
                if (!e.currentTarget.value.trim()) setSearchOpen(false);
              }}
            />
          )}
          <button className="icon-btn" type="submit" aria-label="Buscar">
            <SearchIcon width={20} height={20} />
          </button>
        </form>
        <button
          type="button"
          className="nav-toggle"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className={`nav-toggle-icon${menuOpen ? " open" : ""}`} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>

      {menuOpen && (
        <nav className="mobile-menu" aria-label="Menu principal">
          <ul>
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  className={isActive(l.href) ? "active" : ""}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={isLoggedIn ? "/admin" : "/admin/login"}
            className="mobile-menu-login"
            onClick={() => setMenuOpen(false)}
          >
            {isLoggedIn ? "Painel" : "Entrar"}
          </Link>
        </nav>
      )}
    </header>
  );
}
