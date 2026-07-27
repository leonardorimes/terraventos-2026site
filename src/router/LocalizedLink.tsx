import { Link, type LinkProps } from 'react-router-dom';
import { buildLocalizedPath, useLang } from './useLang';

/** <Link> que aplica automaticamente o prefixo do idioma atual a um `to` agnóstico de idioma. */
export default function LocalizedLink({ to, ...rest }: LinkProps) {
  const lang = useLang();
  const resolvedTo = typeof to === 'string' ? buildLocalizedPath(lang, to) : to;
  return <Link to={resolvedTo} {...rest} />;
}
