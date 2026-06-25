import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { OportunidadeDetalhe } from '../data/oportunidadesData';
import './ListagemPropriedades.css';

export function resolveProperty(raw: any, lang: string): OportunidadeDetalhe {
  const bl = (lang||'pt').split('-')[0];
  const d = raw.i18n?.[bl] || raw.i18n?.pt || {};
  return { id:raw.id, slug:raw.slug, category:raw.category, image:raw.image, rating:raw.rating,
    gallery:raw.gallery, mapImage:raw.mapImage, mapUrl:raw.mapUrl,
    videoSources:raw.videoSources||[], videoGalleryCredits:raw.videoGalleryCredits||'',
    documents:d.documents||raw.documents||[], reservationUrl:raw.reservationUrl||undefined,
    title:d.title||'', badge:d.badge||'', propertyTitle:d.propertyTitle||'',
    location:d.location||'', exclusiveText:d.exclusiveText||'', summaryDescription:d.summaryDescription||'',
    about:d.about||[], infra:d.infra||[], facilities:d.facilities||[],
    priceTag:d.priceTag||'', price:d.price||'', installments:d.installments||'',
    searchTitle:'',
  } as OportunidadeDetalhe;
}


const parsePrice = (priceStr: string | undefined): number | null => {
  if (!priceStr) return null;
  const str = priceStr.toLowerCase().replace('r$', '').trim();
  if (str.includes('mil')) {
    const num = parseFloat(str.replace(/[^\d.,]/g, '').replace(/\./g, '').replace(',', '.'));
    if (!isNaN(num)) return num * 1000;
  }
  const cleanStr = str.replace(/[^\d,]/g, '');
  if (cleanStr) {
     const num = parseFloat(cleanStr.replace(',', '.'));
     if (!isNaN(num) && num > 0) return num;
  }
  return null;
};

interface PropriedadesV2Props {
  onSelect?: (item: OportunidadeDetalhe) => void;
}

const PropriedadesV2: React.FC<PropriedadesV2Props> = ({ onSelect }) => {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [userMaxPrice, setUserMaxPrice] = useState<number | null>(null);
  const [rawData, setRawData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/properties-data.json').then(r=>r.json()).then(d=>{setRawData(d);setLoading(false);}).catch(()=>setLoading(false));
  }, []);

  const items = useMemo(() => rawData.map((r:any) => resolveProperty(r, i18n.language)), [rawData, i18n.language]);

  const priceRangeData = useMemo(() => {
    const prices = items.map(i => parsePrice(i.price)).filter(p => p !== null) as number[];
    return { 
      min: prices.length ? Math.min(...prices) : 0, 
      max: prices.length ? Math.max(...prices) : 20000000 
    };
  }, [items]);

  const currentMaxPrice = userMaxPrice !== null ? userMaxPrice : priceRangeData.max;

  const normalizeString = (str: string) => {
    return str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : '';
  };

  const filteredItems = useMemo(() => {
    const searchNormalized = normalizeString(searchTerm);

    return items.filter((item) => {
      const searchableText = [
        item.propertyTitle,
        item.location,
        item.price,
        item.searchTitle,
        item.category,
        item.summaryDescription,
        item.exclusiveText,
        item.badge
      ].filter(Boolean).map(s => normalizeString(s!)).join(' ');

      const matchesSearch = searchableText.includes(searchNormalized);
      const matchesFilter = selectedFilter === 'all' || item.category === selectedFilter;
      
      let itemPrice = priceRangeData.max;
      const parsed = parsePrice(item.price);
      if (parsed !== null) itemPrice = parsed;
      const matchesPrice = itemPrice <= currentMaxPrice;

      return matchesSearch && matchesFilter && matchesPrice;
    });
  }, [items, searchTerm, selectedFilter, currentMaxPrice, priceRangeData]);

  const showTaiba = false; /* Terreno de Taíba (< 750k) comentado a pedido do usuário */

  const filterOptions = ['all', 'venda', 'lancamento', 'temporada', 'investimento'];

  if (loading) return <section className="listing-page" data-reveal-managed="true"><div className="listing-header"><h1 className="listing-title">{t('nav.oportunidades')}</h1></div></section>;

  return (
    <section className="listing-page" data-reveal-managed="true">
      <div className="listing-header">
        <button 
          className="back-to-home" 
          onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: '/' }))}
          aria-label="Voltar para o início"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <h1 className="listing-title">{t('nav.oportunidades')}</h1>
        <p className="listing-subtitle">{t('oportunidades.badge')}</p>
      </div>

      <div className="listing-controls">
        <div className="search-box">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            placeholder={t('hero.card.experience').split('\n')[0] || "Buscar propriedade..."} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-chips">
          {filterOptions.map((filter) => (
            <button
              key={filter}
              className={`filter-chip ${selectedFilter === filter ? 'active' : ''}`}
              onClick={() => setSelectedFilter(filter)}
            >
              {t(`categorias.${filter}`)}
            </button>
          ))}
        </div>

        <div className="price-slider-container">
          <div className="price-slider-header">
            <span>Preço Máximo:</span>
            <span className="price-slider-value">
              {currentMaxPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
          <input 
            type="range" 
            className="price-slider"
            min={priceRangeData.min} 
            max={priceRangeData.max} 
            step="10000"
            value={currentMaxPrice} 
            onChange={(e) => setUserMaxPrice(Number(e.target.value))} 
          />
        </div>
      </div>

      <div className="listing-grid">
        {/* OPÇÃO DE TAÍBA FIXA NO TOPO */}
        {showTaiba && (
          <a 
            href="/taiba"
            className="property-card"
            onClick={(e) => {
              e.preventDefault();
              window.dispatchEvent(new CustomEvent('navigate', { detail: '/taiba' }));
            }}
          >
            <div className="property-card-image" style={{ backgroundImage: `url("/taiba/Picture.png")` }}>
              <div className="property-badge">Investimento</div>
            </div>
            <div className="property-card-content">
              <h3 className="property-card-title">Oportunidades Exclusivas em Taíba</h3>
              <p className="property-card-location">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                Taíba, Ceará, Brasil
              </p>
              <div className="property-card-footer">
                <div className="property-price">
                  <span className="price-tag">A partir de</span>
                  <span className="price-value">R$ 110.000,00</span>
                </div>
                <div className="view-details-btn">
                  Ver Opções
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px' }}>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </div>
            </div>
          </a>
        )}

        {filteredItems.length > 0 || showTaiba ? (
          filteredItems.map((item) => (
            <a 
              key={item.id} 
              href={`/propriedade-v2/${item.slug}`}
              className="property-card" 
              onClick={(e) => {
                e.preventDefault();
                if(onSelect) onSelect(item); else window.dispatchEvent(new CustomEvent('navigate',{detail:'/propriedade-v2/'+item.slug}));
              }}
            >
              <div className="property-card-image" style={{ backgroundImage: `url("${item.image}")` }}>
                <div className="property-badge">{item.badge}</div>
              </div>
              <div className="property-card-content">
                <h3 className="property-card-title">{item.propertyTitle}</h3>
                <p className="property-card-location">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  {item.location}
                </p>
                <div className="property-card-footer">
                  <div className="property-price">
                    <span className="price-tag">{item.priceTag}</span>
                    <span className="price-value">{item.price}</span>
                  </div>
                  <div className="view-details-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="7" y1="17" x2="17" y2="7"></line>
                      <polyline points="7 7 17 7 17 17"></polyline>
                    </svg>
                  </div>
                  <button 
                    className="share-property-btn"
                    title={t('common.share') || "Compartilhar"}
                    onClick={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const shareData = {
                        title: item.propertyTitle,
                        text: `${t('common.shareText')}${item.propertyTitle}`,
                        url: `${window.location.origin}/propriedade/${item.slug}`
                      };

                      if (navigator.share) {
                        try {
                          await navigator.share(shareData);
                        } catch (err) {
                          if ((err as Error).name !== 'AbortError') console.error('Error sharing:', err);
                        }
                      } else {
                        try {
                          await navigator.clipboard.writeText(shareData.url);
                          alert(t('common.linkCopied') || 'Link copiado!');
                        } catch (err) {
                          console.error('Could not copy text: ', err);
                        }
                      }
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="18" cy="5" r="3"></circle>
                      <circle cx="6" cy="12" r="3"></circle>
                      <circle cx="18" cy="19" r="3"></circle>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                    </svg>
                  </button>
                </div>
              </div>
            </a>
          ))
        ) : (
          <div className="no-results">
            <p>{t('oportunidades.noResults')}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PropriedadesV2;
