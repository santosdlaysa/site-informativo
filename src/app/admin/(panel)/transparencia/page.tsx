import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getActiveCompany } from "@/infrastructure/tenant";
import { prisma } from "@/infrastructure/database/prisma";
import { container } from "@/infrastructure/container";
import { TransparencyManager } from "@/presentation/components/admin/transparency-manager";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Portal da Transparência — Admin" };

export default async function AdminTransparencyPage() {
  const company = await getActiveCompany();
  if (!company || company.slug !== "adsocial") redirect("/admin/posts");
  const [settings, documents] = await Promise.all([
    container.getSettings.execute(),
    prisma.transparencyDocument.findMany({
      where: { companyId: company.id },
      orderBy: [{ referenceYear: "desc" }, { createdAt: "desc" }],
      select: { id: true, title: true, description: true, category: true, referenceYear: true, fileName: true, fileSize: true },
    }),
  ]);
  return <TransparencyManager title={settings.transparencyTitle} description={settings.transparencyDescription} documents={documents} />;
}
