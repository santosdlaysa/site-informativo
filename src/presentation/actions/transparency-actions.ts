"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/infrastructure/auth/auth";
import { prisma } from "@/infrastructure/database/prisma";
import { getActiveCompanyId } from "@/infrastructure/tenant";
import { container } from "@/infrastructure/container";

export type TransparencyFormState = { error?: string; success?: boolean };

const MAX_FILE_SIZE = 3 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
  "image/jpeg",
  "image/png",
]);
const ALLOWED_EXTENSIONS = new Set(["pdf", "doc", "docx", "xls", "xlsx", "csv", "jpg", "jpeg", "png"]);

const fieldsSchema = z.object({
  title: z.string().trim().min(3, "Informe um título com pelo menos 3 caracteres.").max(180),
  description: z.string().trim().max(1000).optional(),
  category: z.string().trim().min(2, "Informe a categoria.").max(80),
  referenceYear: z.union([z.literal(""), z.coerce.number().int().min(1900).max(2200)]).optional(),
});

async function requireAdsocial() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Sessão expirada. Entre novamente.");
  const companyId = await getActiveCompanyId();
  const company = await prisma.company.findUnique({ where: { id: companyId }, select: { slug: true } });
  if (company?.slug !== "adsocial") throw new Error("O Portal da Transparência está disponível apenas para o ADSocial.");
  return companyId;
}

function validateFile(value: FormDataEntryValue | null, required: boolean) {
  if (!(value instanceof File) || value.size === 0) {
    if (required) throw new Error("Selecione um arquivo para publicar.");
    return null;
  }
  const extension = value.name.split(".").pop()?.toLowerCase() ?? "";
  if (!ALLOWED_TYPES.has(value.type) || !ALLOWED_EXTENSIONS.has(extension)) {
    throw new Error("Formato não permitido. Use PDF, Word, Excel, CSV, JPG ou PNG.");
  }
  if (value.size > MAX_FILE_SIZE) throw new Error("O arquivo deve ter no máximo 3 MB.");
  return value;
}

function revalidateTransparency() {
  revalidatePath("/admin/transparencia");
  revalidatePath("/transparencia");
  revalidatePath("/adsocial/transparencia");
}

export async function updateTransparencyIntroAction(
  _previous: TransparencyFormState,
  formData: FormData,
): Promise<TransparencyFormState> {
  try {
    await requireAdsocial();
    const title = String(formData.get("transparencyTitle") ?? "").trim();
    const description = String(formData.get("transparencyDescription") ?? "").trim();
    if (title.length < 3) return { error: "Informe um título válido." };
    if (description.length < 10) return { error: "Informe uma apresentação com pelo menos 10 caracteres." };
    await container.updateSettings.execute({ transparencyTitle: title, transparencyDescription: description });
    revalidateTransparency();
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Não foi possível salvar." };
  }
}

export async function createTransparencyDocumentAction(
  _previous: TransparencyFormState,
  formData: FormData,
): Promise<TransparencyFormState> {
  try {
    const companyId = await requireAdsocial();
    const parsed = fieldsSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
    const file = validateFile(formData.get("file"), true)!;
    await prisma.transparencyDocument.create({
      data: {
        companyId,
        title: parsed.data.title,
        description: parsed.data.description || null,
        category: parsed.data.category,
        referenceYear: parsed.data.referenceYear === "" ? null : parsed.data.referenceYear,
        published: true,
        fileName: file.name,
        mimeType: file.type,
        fileSize: file.size,
        fileData: new Uint8Array(await file.arrayBuffer()),
      },
    });
    revalidateTransparency();
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Não foi possível publicar o documento." };
  }
}

export async function updateTransparencyDocumentAction(id: string, formData: FormData): Promise<void> {
  const companyId = await requireAdsocial();
  const parsed = fieldsSchema.parse(Object.fromEntries(formData));
  const file = validateFile(formData.get("file"), false);
  const existing = await prisma.transparencyDocument.findFirst({ where: { id, companyId }, select: { id: true } });
  if (!existing) throw new Error("Documento não encontrado.");
  await prisma.transparencyDocument.update({
    where: { id },
    data: {
      title: parsed.title,
      description: parsed.description || null,
      category: parsed.category,
      referenceYear: parsed.referenceYear === "" ? null : parsed.referenceYear,
      published: true,
      ...(file ? {
        fileName: file.name,
        mimeType: file.type,
        fileSize: file.size,
        fileData: new Uint8Array(await file.arrayBuffer()),
      } : {}),
    },
  });
  revalidateTransparency();
}

export async function deleteTransparencyDocumentAction(id: string): Promise<void> {
  const companyId = await requireAdsocial();
  await prisma.transparencyDocument.deleteMany({ where: { id, companyId } });
  revalidateTransparency();
}
