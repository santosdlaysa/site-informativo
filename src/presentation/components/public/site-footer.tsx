import Image from "next/image";
import logoHorizontal from "@/assets/Logo horizontal.png";
import type { SiteSettingsData } from "@/core/domain/settings/site-settings";

const SOCIAL_ICONS = {
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H9v3h2v6h3v-6h3l1-3h-4V9c0-.6.4-1 1-1z" />
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 5.8c-.7.3-1.5.5-2.3.6.8-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1a4 4 0 0 0-6.9 3.7A11.4 11.4 0 0 1 3.7 4.6a4 4 0 0 0 1.2 5.4c-.6 0-1.2-.2-1.8-.5a4 4 0 0 0 3.2 4 4 4 0 0 1-1.8.1 4 4 0 0 0 3.7 2.8A8 8 0 0 1 2 18.1a11.3 11.3 0 0 0 6.1 1.8c7.3 0 11.4-6.1 11.4-11.4v-.5c.8-.6 1.5-1.3 2-2.2z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.9 8H4V20h2.9V8zM5.4 3.5a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4zM20 20h-2.9v-5.9c0-1.4-.5-2.3-1.7-2.3-1 0-1.5.6-1.8 1.3-.1.2-.1.5-.1.8V20H10.6V8h2.8v1.3c.4-.6 1.1-1.5 2.7-1.5 2 0 3.5 1.3 3.5 4.1V20z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" />
    </svg>
  ),
} as const;

export function SiteFooter({ settings }: { settings: SiteSettingsData }) {
  const socials: { key: keyof typeof SOCIAL_ICONS; label: string; href: string }[] = [
    { key: "facebook", label: "Facebook", href: settings.socialFacebook },
    { key: "twitter", label: "Twitter", href: settings.socialTwitter },
    { key: "linkedin", label: "LinkedIn", href: settings.socialLinkedin },
    { key: "instagram", label: "Instagram", href: settings.socialInstagram },
  ];

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-contact" id="contato">
          <div className="fc-about">
            <span className="brand">
              <Image className="brand-logo" src={logoHorizontal} alt="Raros Boa Vista" height={32} />
            </span>
            <p>
              O Centro Social Raros Boa Vista promove capacitação, inclusão digital e
              desenvolvimento artístico de crianças, adolescentes e jovens em Roraima,
              fortalecendo vínculos e gerando redes de apoio para a comunidade.
            </p>
          </div>
          <div className="fc-col">
            <h4>Contato</h4>
            <a href="mailto:Contato@rarosboavista.com.br">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>{" "}
              Contato@rarosboavista.com.br
            </a>
            <a href="tel:+5595999999999">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2z" />
              </svg>{" "}
              (95) 99999-9999
            </a>
            <span className="fc-loc">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>{" "}
              Boa Vista, RR
            </span>
          </div>
          <div className="fc-col">
            <h4>Redes sociais</h4>
            <div className="fc-social">
              {socials.map((s) => {
                const href = (s.href ?? "").trim();
                return (
                  <a
                    key={s.key}
                    href={href || "#"}
                    aria-label={s.label}
                    {...(href ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {SOCIAL_ICONS[s.key]}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="brand">
            <Image className="brand-logo" src={logoHorizontal} alt="Raros Boa Vista" height={26} />
          </span>
          <span>© 2026 Raros Boa Vista. Todos os direitos reservados.</span>
        </div>
      </div>
    </footer>
  );
}
