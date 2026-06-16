"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import logoHorizontal from "@/assets/Logo horizontal.png";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/projeto", label: "O Projeto" },
  { href: "/acoes", label: "Ações" },
  { href: "/programacao", label: "Programação" },
  { href: "/eventos", label: "Eventos" },
];

export function SiteHeader({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Fecha o menu mobile e a busca ao navegar para outra página.
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // Foca o campo ao abrir a busca.
  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/busca?q=${encodeURIComponent(q)}`);
    setSearchOpen(false);
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
        <div className="nav-actions">
          <form className={`header-search${searchOpen ? " open" : ""}`} onSubmit={submitSearch} role="search">
            {searchOpen && (
              <input
                ref={searchInputRef}
                className="header-search-input"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Escape" && setSearchOpen(false)}
                placeholder="Buscar…"
                aria-label="Buscar no site"
              />
            )}
            <button
              type={searchOpen ? "submit" : "button"}
              className="nav-search-btn"
              aria-label="Buscar"
              aria-expanded={searchOpen}
              onClick={() => {
                if (!searchOpen) setSearchOpen(true);
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={20} height={20} aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>
          </form>
        </div>
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
        </nav>
      )}
    </header>
  );
}
