"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import logoHorizontal from "@/assets/Logo horizontal.png";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/acoes", label: "Ações" },
  { href: "/programacao", label: "Programação" },
  { href: "/eventos", label: "Eventos" },
];

export function SiteHeader({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Fecha o menu mobile ao navegar para outra página.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

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
          <Link
            href={isLoggedIn ? "/admin" : "/admin/login"}
            className="nav-login"
          >
            {isLoggedIn ? "Painel" : "Entrar"}
          </Link>
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
