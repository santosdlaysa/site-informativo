import type { SiteSettingsData } from "@/core/domain/settings/site-settings";

function getGroups(settings: SiteSettingsData) {
  const realizacao = [
    settings.qsRealizacaoLogo,
    settings.qsRealizacaoLogo2,
    settings.qsRealizacaoLogo3,
    settings.qsRealizacaoLogo4,
  ]
    .map((p) => (p ?? "").trim())
    .filter(Boolean);
  const partners = [settings.qsPartner1, settings.qsPartner2, settings.qsPartner3, settings.qsPartner4]
    .map((p) => (p ?? "").trim())
    .filter(Boolean);
  return { realizacao, partners };
}

/** Grupos de logos: "Realização" e "Parceiros". Sem o invólucro de seção. */
export function PartnerGroups({ settings }: { settings: SiteSettingsData }) {
  const { realizacao, partners } = getGroups(settings);
  const parceirosLabel = settings.qsPartnersTitle?.trim() || "Parceiros";

  if (realizacao.length === 0 && partners.length === 0) return null;

  return (
    <div className="qs-partner-groups">
      {realizacao.length > 0 && (
        <div className="qs-partner-group">
          <span className="qs-partner-group-label">Realização</span>
          <div className="qs-partners-logos">
            {realizacao.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="qs-partner" key={i} src={src} alt="" />
            ))}
          </div>
        </div>
      )}
      {partners.length > 0 && (
        <div className="qs-partner-group">
          <span className="qs-partner-group-label">{parceirosLabel}</span>
          <div className="qs-partners-logos">
            {partners.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="qs-partner" key={i} src={src} alt="" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** Bloco completo (com separador) usado na página /projeto. */
export function QsPartners({ settings }: { settings: SiteSettingsData }) {
  const { realizacao, partners } = getGroups(settings);
  if (realizacao.length === 0 && partners.length === 0) return null;

  return (
    <section className="qs-partners">
      <PartnerGroups settings={settings} />
    </section>
  );
}
