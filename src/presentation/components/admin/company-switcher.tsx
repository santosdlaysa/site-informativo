"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { selectCompanyAction } from "@/presentation/actions/company-actions";

type Company = { id: string; name: string; slug: string };

export function CompanySwitcher({ companies, activeCompanyId }: { companies: Company[]; activeCompanyId: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  if (companies.length < 2) return null;

  return (
    <label className="company-switcher">
      <span>Empresa</span>
      <select
        value={activeCompanyId}
        disabled={pending}
        onChange={(event) => {
          const id = event.target.value;
          startTransition(async () => {
            await selectCompanyAction(id);
            router.refresh();
          });
        }}
      >
        {companies.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}
      </select>
    </label>
  );
}
