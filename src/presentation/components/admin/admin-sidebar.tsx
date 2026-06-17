"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  PostsIcon,
  NewPostIcon,
  CalendarIcon,
  EventIcon,
  SettingsIcon,
  LogoutIcon,
  UsersIcon,
} from "../icons";
import { logoutAction } from "@/presentation/actions/auth-actions";
import type { UserRole } from "@/core/domain/user/user-role";
import logoHorizontal from "@/assets/Logo horizontal.png";

const NAV = [
  { href: "/admin/posts", label: "Posts", Icon: PostsIcon, roles: ["admin", "editor", "viewer"], match: (p: string) => p === "/admin/posts" || (p.startsWith("/admin/posts/") && !p.endsWith("/novo")) },
  { href: "/admin/posts/novo", label: "Novo Post", Icon: NewPostIcon, roles: ["admin", "editor"], match: (p: string) => p.startsWith("/admin/posts/novo") },
  { href: "/admin/programacao", label: "Programação", Icon: CalendarIcon, roles: ["admin"], match: (p: string) => p.startsWith("/admin/programacao") },
  { href: "/admin/eventos", label: "Eventos", Icon: EventIcon, roles: ["admin"], match: (p: string) => p.startsWith("/admin/eventos") },
  { href: "/admin/calendario", label: "Calendário", Icon: CalendarIcon, roles: ["admin"], match: (p: string) => p.startsWith("/admin/calendario") },
  { href: "/admin/editores", label: "Editores", Icon: UsersIcon, roles: ["admin"], match: (p: string) => p.startsWith("/admin/editores") },
  { href: "/admin/configuracoes", label: "Configurações", Icon: SettingsIcon, roles: ["admin"], match: (p: string) => p.startsWith("/admin/configuracoes") },
];

export function AdminSidebar({ currentUserRole }: { currentUserRole: UserRole }) {
  const pathname = usePathname();
  const navItems = NAV.filter((item) => item.roles.includes(currentUserRole));

  return (
    <aside className="sidebar">
      <div className="brand">
        <Image src={logoHorizontal} alt="Raros Boa Vista" height={56} />
      </div>
      <nav className="nav">
        {navItems.map(({ href, label, Icon, match }) => (
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
