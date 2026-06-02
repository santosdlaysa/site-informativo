import "@/styles/admin.css";

/** Layout raiz do /admin: carrega o sistema visual do painel.
 *  O shell com sidebar e o guard de sessão ficam no grupo (panel). */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
