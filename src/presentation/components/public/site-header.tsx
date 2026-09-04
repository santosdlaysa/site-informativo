"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import logoHorizontal from "@/assets/Logo horizontal.png";
import { CompanyLink, useCompanyPath } from "./company-link";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/projeto", label: "O Projeto" },
  { href: "/acoes", label: "Ações" },
  { href: "/programacao", label: "Programação" },
  { href: "/eventos", label: "Eventos" },
];

export function SiteHeader({ isLoggedIn = false, company }: { isLoggedIn?: boolean; company?: { name: string; slug: string; logo?: string | null } | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const companyPath = useCompanyPath();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const links = company?.slug === "adsocial"
    ? [...LINKS, { href: "/transparencia", label: "Portal da Transparência" }]
    : LINKS;
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isActive = (href: string) => {
    const target = companyPath(href);
    return href === "/" ? pathname === target : pathname.startsWith(target);
  };

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
    router.push(companyPath(`/busca?q=${encodeURIComponent(q)}`));
    setSearchOpen(false);
  }

  return (
    <header className="site-header">
      <div className="wrap nav">
        <CompanyLink className="brand" href="/" aria-label={`${company?.name || "Site"} — início`}>
          {company?.logo ? (
            <img
              className="brand-logo brand-logo--company"
              src={company.logo}
              alt={company.name}
              style={{ width: "auto", height: 58, maxWidth: 220, objectFit: "contain" }}
            />
          ) : (
            <Image className="brand-logo" src={logoHorizontal} alt="Raros Boa Vista" priority width={320} height={38} style={{ width: "auto", height: 38, maxWidth: "100%", objectFit: "contain" }} />
          )}
        </CompanyLink>
        <ul className="menu">
          {links.map((l) => (
            <li key={l.href}>
              <CompanyLink className={`${isActive(l.href) ? "active" : ""}${l.href === "/transparencia" ? " menu-portal-link" : ""}`} href={l.href}>
                {l.label}
              </CompanyLink>
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
            {links.map((l) => (
              <li key={l.href}>
                <CompanyLink
                  className={`${isActive(l.href) ? "active" : ""}${l.href === "/transparencia" ? " menu-portal-link" : ""}`}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                >
                  {l.label}
                </CompanyLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
