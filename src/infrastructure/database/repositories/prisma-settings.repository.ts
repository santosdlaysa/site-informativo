import { prisma } from "@/infrastructure/database/prisma";
import type { SettingsRepository } from "@/core/domain/settings/settings.repository";
import { DEFAULT_SETTINGS, type SiteSettingsData } from "@/core/domain/settings/site-settings";

export class PrismaSettingsRepository implements SettingsRepository {
  async get(): Promise<SiteSettingsData> {
    const row = await prisma.siteSettings.findUnique({ where: { id: "default" } });
    if (!row) return { ...DEFAULT_SETTINGS };
    return {
      heroBgImage: row.heroBgImage ?? null,
      heroTag: row.heroTag,
      heroTitle: row.heroTitle,
      heroDesc: row.heroDesc,
      heroCta1Text: row.heroCta1Text,
      heroCta1Href: row.heroCta1Href,
      heroCta2Text: row.heroCta2Text,
      heroCta2Href: row.heroCta2Href,
      stat1Num: row.stat1Num,
      stat1Label: row.stat1Label,
      stat2Num: row.stat2Num,
      stat2Label: row.stat2Label,
      stat3Num: row.stat3Num,
      stat3Label: row.stat3Label,
      stat4Num: row.stat4Num,
      stat4Label: row.stat4Label,
    };
  }

  async update(data: Partial<SiteSettingsData>): Promise<void> {
    await prisma.siteSettings.upsert({
      where: { id: "default" },
      create: { id: "default", ...DEFAULT_SETTINGS, ...data },
      update: data,
    });
  }
}
