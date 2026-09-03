"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { selectCompanyAction } from "@/presentation/actions/company-actions";
import favicon from "@/assets/Favicon.png";

type Company = { id: string; name: string; slug: string; logo?: string | null };

export function CompanySwitcher({
  companies,
  activeCompanyId,
  onSwitchStart,
}: {
  companies: Company[];
  activeCompanyId: string;
  onSwitchStart?: (companyName: string) => void;
}) {
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const activeCompany = companies.find((company) => company.id === activeCompanyId) ?? companies[0];

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  if (!activeCompany) return null;

  function chooseCompany(id: string) {
    setOpen(false);
    if (id === activeCompany?.id) return;
    const nextCompany = companies.find((company) => company.id === id);
    onSwitchStart?.(nextCompany?.name ?? "empresa");
    startTransition(async () => {
      await selectCompanyAction(id);
      router.refresh();
    });
  }

  return (
    <div className={`company-switcher ${open ? "is-open" : ""}`} ref={rootRef}>
      <button type="button" className="company-switcher-trigger" onClick={() => setOpen((value) => !value)} disabled={pending} aria-expanded={open}>
        <span className="company-switcher-icon"><Image src={activeCompany.logo || favicon} alt="" width={23} height={23} unoptimized={!!activeCompany.logo} /></span>
        <span className="company-switcher-copy">
          <small>Gerenciando</small>
          <strong>{pending ? "Carregando…" : activeCompany.name}</strong>
        </span>
        {pending ? <span className="company-switcher-spinner" aria-label="Carregando" /> : <span className="company-switcher-arrow" aria-hidden="true" />}
      </button>
      {open && (
        <div className="company-switcher-menu" role="menu">
          <div className="company-switcher-menu-title">Selecione uma empresa</div>
          {companies.map((company) => (
            <button key={company.id} type="button" role="menuitem" className={company.id === activeCompany.id ? "selected" : ""} onClick={() => chooseCompany(company.id)}>
              <span className="company-option-avatar"><Image src={company.logo || favicon} alt="" width={19} height={19} unoptimized={!!company.logo} /></span>
              <span>{company.name}</span>
              {company.id === activeCompany.id && <span className="company-option-check">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
