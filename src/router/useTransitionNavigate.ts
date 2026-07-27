import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildLocalizedPath, useLang } from './useLang';

/**
 * Navega para um path agnóstico de idioma (formato pt, ex: '/propriedade/slug'),
 * aplicando automaticamente o prefixo do idioma atual, e evita cliques duplicados
 * durante a animação de transição de página (280ms de saída + 620ms de bloqueio).
 */
export function useTransitionNavigate() {
  const navigate = useNavigate();
  const lang = useLang();
  const lockRef = useRef(false);

  return (path: string) => {
    if (lockRef.current) return;
    lockRef.current = true;
    navigate(buildLocalizedPath(lang, path));
    window.setTimeout(() => {
      lockRef.current = false;
    }, 900);
  };
}
