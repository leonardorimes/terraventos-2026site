import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PaginaIndividual from '../components/PaginaIndividual';
import Pagina404 from '../components/Pagina404';
import { getOportunidadesData } from '../data/oportunidadesDataI18n';
import { useAppShellContext } from '../router/appShellContext';

export default function PropriedadeIndividualPage() {
  const { slug } = useParams<{ slug: string }>();
  const { i18n } = useTranslation();
  const { previousPath, transitionNavigate } = useAppShellContext();

  const item = getOportunidadesData(i18n.language).find((o) => o.slug === slug);

  if (!item) {
    return <Pagina404 onBack={() => transitionNavigate(previousPath || '/')} />;
  }

  return <PaginaIndividual item={item} />;
}
