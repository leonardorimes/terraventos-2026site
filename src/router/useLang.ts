import { useLocation } from 'react-router-dom';

export const SUPPORTED_LANGS = ['en', 'es'] as const;
export type SupportedLang = (typeof SUPPORTED_LANGS)[number];

/**
 * Idioma atual a partir do prefixo de URL, 'pt' quando não prefixado.
 * Lido diretamente do pathname (não de um :lang de rota) para que rotas
 * desconhecidas (ex: /fr/..., /rota-qualquer) nunca sejam confundidas com
 * um prefixo de idioma — elas simplesmente não têm rota "en"/"es" para casar.
 */
export function useLang(): string {
  const { pathname } = useLocation();
  const match = pathname.match(/^\/(en|es)(\/|$)/);
  return match ? match[1] : 'pt';
}

/**
 * Constrói a URL localizada para um path "agnóstico de idioma" (sempre no formato pt, ex: '/propriedades').
 * pt não tem prefixo; en/es ganham o prefixo /en ou /es.
 */
export function buildLocalizedPath(lang: string, path: string): string {
  if (!lang || lang === 'pt') return path;
  return path === '/' ? `/${lang}/` : `/${lang}${path}`;
}
