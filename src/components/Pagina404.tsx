import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './Pagina404.css';

export default function Pagina404({ onBack }: { onBack: () => void }) {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = `${t('pagina.naoEncontrada', 'Página não encontrada')} | Terra Ventos`;
  }, [t]);

  return (
    <div className="pagina-404">
      <div className="pagina-404-content">
        <h1 className="pagina-404-title">404</h1>
        <h2 className="pagina-404-subtitle">{t('pagina.naoEncontrada', 'Página não encontrada')}</h2>
        <p className="pagina-404-text">
          {t('pagina.naoEncontradaTexto', 'A página que você tentou acessar não existe, foi movida ou está temporariamente indisponível.')}
        </p>
        <button 
          className="pagina-404-back-button"
          onClick={onBack}
        >
          {t('pagina.backToHome', 'Voltar para o Início')}
        </button>
      </div>
    </div>
  );
}
