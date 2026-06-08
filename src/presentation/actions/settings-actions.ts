"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/infrastructure/auth/auth";
import { container } from "@/infrastructure/container";

export interface SettingsFormState {
  error?: string;
  success?: boolean;
}

export async function updateSettingsAction(
  _prev: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Sessão expirada. Entre novamente." };

  const get = (key: string) => (formData.get(key) as string | null) ?? "";

  await container.updateSettings.execute({
    heroBgImage: get("heroBgImage") || null,
    qsImage: get("qsImage") || null,
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
