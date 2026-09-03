"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "./admin-sidebar";
import { ForcePasswordChangeModal } from "./force-password-change-modal";
import { ToastRouteListener, ToastContainer } from "./toast";
import type { UserRole } from "@/core/domain/user/user-role";

type AdminCompany = {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
};

function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace("#", "");
  if (!/^[0-9a-f]{6}$/i.test(normalized)) return `rgba(21, 128, 61, ${alpha})`;
  const value = Number.parseInt(normalized, 16);
  return `rgba(${value >> 16}, ${(value >> 8) & 255}, ${value & 255}, ${alpha})`;
}

function mixWithBlack(hex: string, blackAmount: number) {
  const normalized = hex.replace("#", "");
  if (!/^[0-9a-f]{6}$/i.test(normalized)) return hex;
  const value = Number.parseInt(normalized, 16);
  const factor = 1 - blackAmount;
  const channel = (shift: number) => Math.round(((value >> shift) & 255) * factor).toString(16).padStart(2, "0");
  return `#${channel(16)}${channel(8)}${channel(0)}`;
}

export function AdminPanelClient({
  role,
  passwordChangeRequired,
  companies,
  activeCompanyId,
  children,
}: {
  role: UserRole;
  passwordChangeRequired: boolean;
  companies?: AdminCompany[];
  activeCompanyId?: string;
  children?: React.ReactNode;
}) {
  const [switchingCompanyName, setSwitchingCompanyName] = useState<string | null>(null);
  const activeCompany = companies?.find((company) => company.id === activeCompanyId);
  const primary = activeCompany?.primaryColor || "#703cc0";
  const secondary = activeCompany?.secondaryColor || "#267ce8";
  const hasCustomPalette = Boolean(activeCompany?.primaryColor && activeCompany?.secondaryColor);
  const themeStyle = hasCustomPalette
    ? {
        "--navy": mixWithBlack(secondary, 0.62),
        "--navy-2": mixWithBlack(secondary, 0.74),
        "--nav-active": mixWithBlack(secondary, 0.25),
        "--purple": secondary,
        "--blue": secondary,
        "--blue-hover": mixWithBlack(secondary, 0.16),
        "--blue-accent": primary,
        "--brand-gradient": `linear-gradient(135deg, ${secondary} 0%, ${mixWithBlack(secondary, 0.18)} 58%, ${primary} 100%)`,
        "--admin-accent": primary,
        "--admin-focus-ring": hexToRgba(secondary, 0.18),
        "--admin-button-shadow": hexToRgba(secondary, 0.36),
        "--admin-button-shadow-hover": hexToRgba(secondary, 0.46),
        "--admin-switcher-bg": `linear-gradient(135deg, ${mixWithBlack(secondary, 0.43)} 0%, ${mixWithBlack(secondary, 0.58)} 100%)`,
        "--admin-switcher-hover": `linear-gradient(135deg, ${mixWithBlack(secondary, 0.32)} 0%, ${mixWithBlack(secondary, 0.48)} 100%)`,
        "--admin-switcher-border": hexToRgba(primary, 0.42),
        "--admin-switcher-label": primary,
        "--admin-option-bg": hexToRgba(primary, 0.14),
        "--admin-option-color": mixWithBlack(secondary, 0.08),
      }
    : undefined;

  useEffect(() => {
    setSwitchingCompanyName(null);
  }, [activeCompanyId]);

  useEffect(() => {
    if (!switchingCompanyName) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [switchingCompanyName]);

  return (
    <div className={`app admin-theme--${activeCompany?.slug || "raros-boa-vista"}`} style={themeStyle as React.CSSProperties | undefined}>
      <AdminSidebar
        currentUserRole={role}
        companies={companies}
        activeCompanyId={activeCompanyId}
        onCompanySwitchStart={setSwitchingCompanyName}
      />
      <main className="main">{children}</main>
      {switchingCompanyName && (
        <div className="company-loading-overlay" role="status" aria-live="assertive" aria-label="Carregando dados da empresa">
          <div className="company-loading-card">
            <span className="company-loading-spinner" aria-hidden="true" />
            <strong>Carregando {switchingCompanyName}</strong>
            <span>Aguarde enquanto preparamos todos os dados da empresa.</span>
          </div>
        </div>
      )}
      {passwordChangeRequired && <ForcePasswordChangeModal />}
      <ToastRouteListener />
      <ToastContainer />
    </div>
  );
}
