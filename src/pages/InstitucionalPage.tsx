import PaginaInstitucional from '../components/PaginaInstitucional';
import { useAppShellContext } from '../router/appShellContext';

type Props = {
  pageType: 'quem-somos' | 'termos-e-condicoes' | 'politica-de-privacidade' | 'contato';
};

export default function InstitucionalPage({ pageType }: Props) {
  const { previousPath, transitionNavigate } = useAppShellContext();

  return (
    <PaginaInstitucional
      pageType={pageType}
      onBack={() => transitionNavigate(previousPath || '/')}
    />
  );
}
