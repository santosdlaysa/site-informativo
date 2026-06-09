import type { SiteSettingsData } from "@/core/domain/settings/site-settings";

export function QsPartners({ settings }: { settings: SiteSettingsData }) {
  const partners = [settings.qsPartner1, settings.qsPartner2, settings.qsPartner3, settings.qsPartner4]
    .map((p) => (p ?? "").trim())
    .filter(Boolean);

  const realizacao = settings.qsRealizacao?.trim();
  const parcerias = settings.qsParcerias?.trim();

  if (partners.length === 0 && !realizacao && !parcerias) return null;

  return (
    <div className="qs-partners">
      {settings.qsPartnersTitle?.trim() && (
        <h3 className="qs-partners-title">{settings.qsPartnersTitle}</h3>
      )}
      {partners.length > 0 && (
        <div className="qs-partners-row">
          {partners.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="qs-partner" key={i} src={src} alt="" />
          ))}
        </div>
      )}
      {(realizacao || parcerias) && (
        <div className="qs-credits">
          {realizacao && (
            <p><strong>Realização:</strong> {realizacao}</p>
          )}
          {parcerias && (
            <p><strong>Parcerias Institucionais:</strong> {parcerias}</p>
          )}
        </div>
      )}
    </div>
  );
}
