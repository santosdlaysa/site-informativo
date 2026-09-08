"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/infrastructure/auth/auth";
import { container } from "@/infrastructure/container";
import { normalizeUserRole } from "@/core/domain/user/user-role";

export interface SettingsFormState {
  error?: string;
  success?: boolean;
}

/** As configurações do site são exclusivas do administrador. */
async function requireAdmin(): Promise<SettingsFormState | null> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Sessão expirada. Entre novamente." };
  if (normalizeUserRole(session.user.role) !== "admin") {
    return { error: "Apenas o administrador pode alterar as configurações do site." };
  }
  return null;
}

export async function updateHeroSettingsAction(
  _prev: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  const denied = await requireAdmin();
  if (denied) return denied;

  const get = (key: string) => (formData.get(key) as string | null) ?? "";

  await container.updateSettings.execute({
    heroBgImage: get("heroBgImage") || null,
    heroTag: get("heroTag"),
    heroTitle: get("heroTitle"),
    heroDesc: get("heroDesc"),
    heroCta1Text: get("heroCta1Text"),
    heroCta1Href: get("heroCta1Href"),
    heroCta2Text: get("heroCta2Text"),
    heroCta2Href: get("heroCta2Href"),
    stat1Num: get("stat1Num"),
    stat1Label: get("stat1Label"),
    stat2Num: get("stat2Num"),
    stat2Label: get("stat2Label"),
    stat3Num: get("stat3Num"),
    stat3Label: get("stat3Label"),
    stat4Num: get("stat4Num"),
    stat4Label: get("stat4Label"),
  });

  revalidatePath("/");
  revalidatePath("/admin/configuracoes");
  return { success: true };
}

export async function updateQuemSomosAction(
  _prev: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  const denied = await requireAdmin();
  if (denied) return denied;

  const get = (key: string) => (formData.get(key) as string | null) ?? "";

  await container.updateSettings.execute({
    qsImage: get("qsImage") || null,
    qsTag: get("qsTag"),
    qsTitle: get("qsTitle"),
    qsBody1: get("qsBody1"),
    qsBody2: get("qsBody2"),
    qsFeature1Title: get("qsFeature1Title"),
    qsFeature1Desc: get("qsFeature1Desc"),
    qsFeature2Title: get("qsFeature2Title"),
    qsFeature2Desc: get("qsFeature2Desc"),
    qsFullText: get("qsFullText"),
    qsPartnersTitle: get("qsPartnersTitle"),
    qsRealizacaoLogo: get("qsRealizacaoLogo") || null,
    qsRealizacaoLogo2: get("qsRealizacaoLogo2") || null,
    qsRealizacaoLogo3: get("qsRealizacaoLogo3") || null,
    qsRealizacaoLogo4: get("qsRealizacaoLogo4") || null,
    qsPartner1: get("qsPartner1") || null,
    qsPartner2: get("qsPartner2") || null,
    qsPartner3: get("qsPartner3") || null,
    qsPartner4: get("qsPartner4") || null,
  });

  revalidatePath("/");
  revalidatePath("/projeto");
  revalidatePath("/admin/configuracoes");
  return { success: true };
}

export async function updateRedesSociaisAction(
  _prev: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  const denied = await requireAdmin();
  if (denied) return denied;

  const get = (key: string) => ((formData.get(key) as string | null) ?? "").trim();

  await container.updateSettings.execute({
    socialFacebook: get("socialFacebook"),
    socialTwitter: get("socialTwitter"),
    socialLinkedin: get("socialLinkedin"),
    socialInstagram: get("socialInstagram"),
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin/configuracoes");
  return { success: true };
}

export async function updateContactSettingsAction(
  _prev: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  const denied = await requireAdmin();
  if (denied) return denied;

  const contactEmail = ((formData.get("contactEmail") as string | null) ?? "").trim();
  const contactPhone = ((formData.get("contactPhone") as string | null) ?? "").trim();

  if (contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
    return { error: "Informe um e-mail válido." };
  }

  await container.updateSettings.execute({ contactEmail, contactPhone });

  revalidatePath("/", "layout");
  revalidatePath("/admin/configuracoes");
  return { success: true };
}
