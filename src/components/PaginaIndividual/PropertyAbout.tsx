import { useTranslation } from 'react-i18next';
import type { OportunidadeDetalhe } from '../../data/oportunidadesData';
import { getFacilityIcon } from '../../utils/facilityIcons';

type Props = {
  item: OportunidadeDetalhe;
};

export default function PropertyAbout({ item }: Props) {
  const { t } = useTranslation();

  return (
    <>
      <h2 className="pi-section-title reveal-title">{t('pagina.about')}</h2>
      {item.about.map((paragraph) => (
        <p key={paragraph} className="pi-text">
          {paragraph}
        </p>
      ))}

      <h3 className="pi-section-subtitle">{t('pagina.infra')}</h3>
      <ul className="pi-infra-list">
        {item.infra.map((info) => (
          <li key={info}>
            <svg
              width="22" height="22" viewBox="0 0 24 24"
              fill="none" stroke="var(--gold, #C4B096)" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
              className="pi-check-icon"
            >
              <rect x="2" y="2" width="20" height="20" rx="6" ry="6"></rect>
              <path d="M8 12.5l2.5 2.5 5.5-6.5"></path>
            </svg>
            <span>{info}</span>
          </li>
        ))}
      </ul>

      <h3 className="pi-section-subtitle">{t('pagina.facilities')}</h3>
      <div className="pi-facilities">
        {item.facilities.map((facilidadeOrig) => {
          const isUnavailable = facilidadeOrig.startsWith('!');
          const facilidade = isUnavailable ? facilidadeOrig.substring(1) : facilidadeOrig;

          return (
            <span key={facilidadeOrig} className={`pi-facility-chip ${isUnavailable ? 'is-unavailable' : ''}`}>
              {getFacilityIcon(facilidade)}
              <span className="pi-facility-text">{facilidade}</span>
            </span>
          );
        })}
      </div>
    </>
  );
}
