"use client";

import { AdminSidebar } from "./admin-sidebar";
import { ForcePasswordChangeModal } from "./force-password-change-modal";
import { ToastRouteListener, ToastContainer } from "./toast";
import type { UserRole } from "@/core/domain/user/user-role";

export function AdminPanelClient({
  role,
  passwordChangeRequired,
  companySwitcher,
  children,
}: {
  role: UserRole;
  passwordChangeRequired: boolean;
  companySwitcher?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="app">
      <AdminSidebar currentUserRole={role} />
      <main className="main"><div className="main-company-switcher">{companySwitcher}</div>{children}</main>
      {passwordChangeRequired && <ForcePasswordChangeModal />}
      <ToastRouteListener />
      <ToastContainer />
    </div>
  );
}
