import { useEffect } from "react";
import "./VentoAfavor.css";
import { useLang } from "../router/useLang";
import { PAGE_KEYWORDS, type SeoLang } from "../utils/seoKeywords";

interface VentoAfavorProps {
  onBack: () => void;
}

const SEO_COPY: Record<SeoLang, { title: string; description: string }> = {
  pt: {
    title: 'Vento a Favor | Comunidade Terra Ventos',
    description: 'A comunidade Terra Ventos para investidores e apaixonados por kitesurf no litoral do Ceará.',
  },
  en: {
    title: 'Vento a Favor | Terra Ventos Community',
    description: 'The Terra Ventos community for investors and kitesurfing enthusiasts on the Ceará coast.',
  },
  es: {
    title: 'Vento a Favor | Comunidad Terra Ventos',
    description: 'La comunidad Terra Ventos para inversores y apasionados del kitesurf en el litoral de Ceará.',
  },
};

export default function VentoAfavor({ onBack }: VentoAfavorProps) {
  const lang = (useLang() as SeoLang) || 'pt';

  // Página fica fora do AppShell (fullscreen), então não herda o "Global SEO Reset"
  // nem o efeito de canonical/hreflang de lá — precisa gerenciar a própria SEO aqui.
  useEffect(() => {
    const { title, description } = SEO_COPY[lang] || SEO_COPY.pt;
    const baseUrl = window.location.origin;
    const imageUrl = `${baseUrl}/og-propriedades.png`;
    const cleanPath = '/ventoafavor';

    document.title = title;

    const updateMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    updateMeta('description', description);
    updateMeta('keywords', PAGE_KEYWORDS.ventoafavor[lang]);
    updateMeta('og:title', title, true);
    updateMeta('og:description', description, true);
    updateMeta('og:image', imageUrl, true);
    updateMeta('og:url', window.location.href, true);
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', imageUrl);

    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());
    const ptUrl = `${baseUrl}${cleanPath}`;
    const enUrl = `${baseUrl}/en${cleanPath}`;
    const esUrl = `${baseUrl}/es${cleanPath}`;
    const alternates: Array<[string, string]> = [
      ['pt-BR', ptUrl],
      ['en-US', enUrl],
      ['es-ES', esUrl],
      ['x-default', ptUrl],
    ];
    alternates.forEach(([hreflang, href]) => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = hreflang;
      link.href = href;
      document.head.appendChild(link);
    });

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `${baseUrl}${window.location.pathname}`;
  }, [lang]);

  return (
    <div className="vaf-container">
      {/* Botão de retorno flutuante */}
      <button
        className="vaf-back-btn"
        onClick={onBack}
        aria-label="Voltar ao site Terra Ventos"
        title="Voltar ao site"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        <span>Terra Ventos</span>
      </button>

      <iframe
        src="https://comunidade.terraventos.com.br/"
        title="Terra Ventos Comunidade — Vento a Favor"
        className="vaf-iframe"
        allow="autoplay; encrypted-media; fullscreen"
        loading="eager"
      />
    </div>
  );
}
