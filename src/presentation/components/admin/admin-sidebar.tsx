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
  DocumentIcon,
} from "../icons";
import { logoutAction } from "@/presentation/actions/auth-actions";
import type { UserRole } from "@/core/domain/user/user-role";
import { CompanySwitcher } from "./company-switcher";

const NAV = [
  { href: "/admin/posts", label: "Posts", Icon: PostsIcon, roles: ["admin", "editor", "viewer"], match: (p: string) => p === "/admin/posts" || (p.startsWith("/admin/posts/") && !p.endsWith("/novo")) },
  { href: "/admin/posts/novo", label: "Novo Post", Icon: NewPostIcon, roles: ["admin", "editor"], match: (p: string) => p.startsWith("/admin/posts/novo") },
  { href: "/admin/programacao", label: "Programação", Icon: CalendarIcon, roles: ["admin", "editor"], match: (p: string) => p.startsWith("/admin/programacao") },
  { href: "/admin/eventos", label: "Eventos", Icon: EventIcon, roles: ["admin", "editor"], match: (p: string) => p.startsWith("/admin/eventos") },
  { href: "/admin/calendario", label: "Calendário", Icon: CalendarIcon, roles: ["admin", "editor"], match: (p: string) => p.startsWith("/admin/calendario") },
  { href: "/admin/transparencia", label: "Portal da Transparência", Icon: DocumentIcon, roles: ["admin", "editor"], company: "adsocial", match: (p: string) => p.startsWith("/admin/transparencia") },
  { href: "/admin/editores", label: "Editores", Icon: UsersIcon, roles: ["admin", "editor"], match: (p: string) => p.startsWith("/admin/editores") },
  { href: "/admin/configuracoes", label: "Configurações", Icon: SettingsIcon, roles: ["admin", "editor"], match: (p: string) => p.startsWith("/admin/configuracoes") },
];

export function AdminSidebar({
  currentUserRole,
  companies,
  activeCompanyId,
  onCompanySwitchStart,
}: {
  currentUserRole: UserRole;
  companies?: { id: string; name: string; slug: string; logo?: string | null }[];
  activeCompanyId?: string;
  onCompanySwitchStart?: (companyName: string) => void;
}) {
  const pathname = usePathname();
  const activeCompany = companies?.find((company) => company.id === activeCompanyId);
  const navItems = NAV.filter((item) => item.roles.includes(currentUserRole) && (!("company" in item) || item.company === activeCompany?.slug));

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="sidebar-global-logo">
          <Image
            src="/movie-sidebar-logo.png"
            alt="Movie"
            width={6000}
            height={6000}
            priority
          />
        </span>
      </div>
      <nav className="nav">
        {companies && activeCompanyId && (
          <CompanySwitcher
            companies={companies}
            activeCompanyId={activeCompanyId}
            onSwitchStart={onCompanySwitchStart}
          />
        )}
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
