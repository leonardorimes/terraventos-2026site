import { useTranslation } from 'react-i18next';
import type { OportunidadeDetalhe } from '../../data/oportunidadesData';

type Props = {
  item: OportunidadeDetalhe;
};

export default function PropertyLocationMap({ item }: Props) {
  const { t } = useTranslation();

  return (
    <>
      <h3 className="pi-section-subtitle">{t('pagina.location')}</h3>
      <div className="pi-map-wrapper">
        {item.mapUrl ? (
          <iframe
            src={item.mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: '400px' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Mapa de localização para ${item.propertyTitle}`}
          />
        ) : (
          <img src={item.mapImage} alt={`Mapa da localizacao de ${item.propertyTitle}`} className="pi-map" />
        )}
      </div>
    </>
  );
}
