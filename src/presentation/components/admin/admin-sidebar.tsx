"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldIcon,
  PostsIcon,
  NewPostIcon,
  CalendarIcon,
  EventIcon,
  SettingsIcon,
  LogoutIcon,
} from "../icons";
import { logoutAction } from "@/presentation/actions/auth-actions";

const NAV = [
  { href: "/admin/posts", label: "Posts", Icon: PostsIcon, match: (p: string) => p === "/admin/posts" || (p.startsWith("/admin/posts/") && !p.endsWith("/novo")) },
  { href: "/admin/posts/novo", label: "Novo Post", Icon: NewPostIcon, match: (p: string) => p.startsWith("/admin/posts/novo") },
  { href: "/admin/programacao", label: "Programação", Icon: CalendarIcon, match: (p: string) => p.startsWith("/admin/programacao") },
  { href: "/admin/eventos", label: "Eventos", Icon: EventIcon, match: (p: string) => p.startsWith("/admin/eventos") },
  { href: "/admin/configuracoes", label: "Configurações", Icon: SettingsIcon, match: (p: string) => p.startsWith("/admin/configuracoes") },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="mark">
          <ShieldIcon width={18} height={18} />
        </span>
        <span className="name">Raros Boa Vista</span>
      </div>
      <nav className="nav">
        {NAV.map(({ href, label, Icon, match }) => (
          <Link key={href} href={href} className={match(pathname) ? "active" : ""}>
            <Icon />
            <span>{label}</span>
          </Link>
        ))}
        <div className="spacer" />
        <form action={logoutAction}>
          <button
            type="submit"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "11px 12px",
              borderRadius: 8,
              color: "#aeb9c9",
              fontSize: 14,
              fontWeight: 500,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              width: "100%",
              font: "inherit",
            }}
          >
            <LogoutIcon width={18} height={18} />
            <span>Sair</span>
          </button>
        </form>
      </nav>
    </aside>
  );
}
