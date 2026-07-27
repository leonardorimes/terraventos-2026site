import { useTranslation } from 'react-i18next';
import ListagemPropriedades from '../components/ListagemPropriedades';
import { getOportunidadesData } from '../data/oportunidadesDataI18n';
import type { OportunidadeDetalhe } from '../data/oportunidadesData';
import { useTransitionNavigate } from '../router/useTransitionNavigate';

export default function PropriedadesPage() {
  const { i18n } = useTranslation();
  const transitionNavigate = useTransitionNavigate();

  const handleSelectOpportunity = (item: OportunidadeDetalhe) => {
    transitionNavigate(`/propriedade/${item.slug}`);
  };

  return (
    <div id="propriedades">
      <ListagemPropriedades
        items={getOportunidadesData(i18n.language).filter((item) => !item.unlisted)}
        onSelect={handleSelectOpportunity}
      />
    </div>
  );
}
