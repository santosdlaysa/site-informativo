"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SearchIcon } from "../icons";
import logoHorizontal from "@/assets/Logo horizontal.png";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/acoes", label: "Ações" },
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
        <button className="icon-btn" aria-label="Buscar">
          <SearchIcon width={20} height={20} />
        </button>
      </div>
    </header>
  );
}
