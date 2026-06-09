import { prisma } from "@/infrastructure/database/prisma";
import type { SettingsRepository } from "@/core/domain/settings/settings.repository";
import { DEFAULT_SETTINGS, type SiteSettingsData } from "@/core/domain/settings/site-settings";

export class PrismaSettingsRepository implements SettingsRepository {
  async get(): Promise<SiteSettingsData> {
    const row = await prisma.siteSettings.findUnique({ where: { id: "default" } });
    if (!row) return { ...DEFAULT_SETTINGS };
    return {
      heroBgImage: row.heroBgImage ?? null,
      qsImage: row.qsImage ?? null,
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
      qsTag: row.qsTag,
      qsTitle: row.qsTitle,
      qsBody1: row.qsBody1,
      qsBody2: row.qsBody2,
      qsFeature1Title: row.qsFeature1Title,
      qsFeature1Desc: row.qsFeature1Desc,
      qsFeature2Title: row.qsFeature2Title,
      qsFeature2Desc: row.qsFeature2Desc,
      qsPartnersTitle: row.qsPartnersTitle,
      qsRealizacao: row.qsRealizacao,
      qsParcerias: row.qsParcerias,
      qsFullText: row.qsFullText ?? null,
      qsRealizacaoLogo: row.qsRealizacaoLogo ?? null,
      qsPartner1: row.qsPartner1 ?? null,
      qsPartner2: row.qsPartner2 ?? null,
      qsPartner3: row.qsPartner3 ?? null,
      qsPartner4: row.qsPartner4 ?? null,
      socialFacebook: row.socialFacebook,
      socialTwitter: row.socialTwitter,
      socialLinkedin: row.socialLinkedin,
      socialInstagram: row.socialInstagram,
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
