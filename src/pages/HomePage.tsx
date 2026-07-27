import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Oportunidades from '../components/Oportunidades';
import ProjetosDestaque from '../components/ProjetosDestaque';
import VillaCondudu from '../components/VillaCondudu';
import Cidades from '../components/Cidades';
import EstudoVentos from '../components/EstudoVentos';
import Mapa from '../components/Mapa';
import Assessoria from '../components/Assessoria';
import Depoimentos from '../components/Depoimentos';
import FormularioLuxo from '../components/FormularioLuxo';
import BlogSection from '../components/BlogSection';
import { oportunidadesData, type OportunidadeDetalhe } from '../data/oportunidadesData';
import { getOportunidadesData } from '../data/oportunidadesDataI18n';
import { useTransitionNavigate } from '../router/useTransitionNavigate';
import { scrollToSection } from '../utils/scrollToSection';

const heroSlides = ['/banners/banners-01.webp', '/banners/banners-02.webp', '/banners/banners-03.webp', '/banners/banners-04.webp'] as const;

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const transitionNavigate = useTransitionNavigate();
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setHeroSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 12000);
    return () => window.clearInterval(intervalId);
  }, []);

  const handleSelectOpportunity = (item: OportunidadeDetalhe) => {
    transitionNavigate(`/propriedade/${item.slug}`);
  };

  return (
    <>
      <div className="hero-background">
        <section className="hero" id="inicio">
          <div className="hero-slides" aria-hidden="true">
            {heroSlides.map((src, index) => {
              const isActive = index === heroSlideIndex;
              return (
                <div
                  key={src}
                  className={`hero-slide ${isActive ? 'is-active' : ''}`}
                  style={{ backgroundImage: `url('${src}')` }}
                />
              );
            })}
          </div>
          <div className="hero-overlay" aria-hidden="true" />

          <div className="hero-nav-arrows">
            <button
              className="hero-nav-arrow prev"
              onClick={() =>
                setHeroSlideIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
              }
              aria-label="Anterior"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button
              className="hero-nav-arrow next"
              onClick={() => setHeroSlideIndex((prev) => (prev + 1) % heroSlides.length)}
              aria-label="Próximo"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>

          <div className="hero-text-container">
            {[0, 1, 2, 3].map((index) => {
              const titles = t('hero.titles', { returnObjects: true }) as string[];
              const subtitles = t('hero.subtitles', { returnObjects: true }) as string[];
              const tags = t('hero.tags', { returnObjects: true }) as string[];
              const isActive = heroSlideIndex === index;

              return (
                <div key={index} className={`hero-content-group ${isActive ? 'is-active' : ''}`}>
                  <div className="hero-tag">{tags[index]}</div>
                  <h2 className="hero-title" dangerouslySetInnerHTML={{ __html: titles[index] }} />
                  <p className="hero-subtitle" dangerouslySetInnerHTML={{ __html: subtitles[index] }} />

                  <div className="hero-cta-wrapper">
                    <button
                      className="cta-button secondary"
                      type="button"
                      onClick={() => {
                        if (index === 1) {
                          const bitupita = oportunidadesData.find((o) => o.id === '02');
                          if (bitupita) handleSelectOpportunity(bitupita);
                        } else if (index === 0) {
                          scrollToSection('estudo');
                        } else if (index === 2) {
                          scrollToSection('regioes');
                        } else {
                          scrollToSection('contato');
                        }
                      }}
                    >
                      {(() => {
                        if (index === 0) return t('estudo.cta');
                        if (index === 1) {
                          const found = getOportunidadesData(i18n.language).find((o) => o.id === '02');
                          return found ? found.badge : 'Venda';
                        }
                        if (index === 2) return t('nav.regioes');
                        return t('hero.saberMais');
                      })()}
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="7" y1="17" x2="17" y2="7"></line>
                        <polyline points="7 7 17 7 17 17"></polyline>
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="floating-card">
            <div className="avatars">
              <img src="/mulher.jpg" alt="Avatar 1" />
              <img src="/pessoa2.avif" alt="Avatar 2" />
              <img src="/pessoa3.avif" alt="Avatar 3" />
            </div>
            <div className="card-info">
              <p dangerouslySetInnerHTML={{ __html: t('hero.card.experience').replace('\n', '<br />') }}></p>
              <div className="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
            </div>
          </div>
        </section>
      </div>

      {/* SEO: Conteúdo descritivo visível para buscadores e leitores */}
      <section className="seo-intro-content">
        <div className="seo-intro-container">
          <p>{t('seo.intro')}</p>
        </div>
      </section>

      <Oportunidades onSelect={handleSelectOpportunity} />

      <section className="beach-banner"></section>

      <ProjetosDestaque onSelect={handleSelectOpportunity} />

      <VillaCondudu onSelect={handleSelectOpportunity} />

      <Cidades />

      <EstudoVentos />
      <BlogSection />

      <Mapa />

      <Assessoria />

      <section className="beach-banner beach-banner--dji"></section>
      <Depoimentos />
      <FormularioLuxo />
    </>
  );
}
