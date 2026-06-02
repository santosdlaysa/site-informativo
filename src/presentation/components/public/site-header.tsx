"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldIcon, SearchIcon } from "../icons";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/posts", label: "Posts" },
  { href: "/programacao", label: "Programação" },
  { href: "/eventos", label: "Eventos" },
];

export function SiteHeader() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="site-header">
      <div className="wrap nav">
        <Link className="brand" href="/">
          <span className="mark">
            <ShieldIcon width={20} height={20} />
          </span>
          MeuBlog
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
        <button className="icon-btn" aria-label="Buscar">
          <SearchIcon width={20} height={20} />
        </button>
      </div>
    </header>
  );
}
