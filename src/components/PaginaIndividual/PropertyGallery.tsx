import { useTranslation } from 'react-i18next';
import type { OportunidadeDetalhe } from '../../data/oportunidadesData';

type Props = {
  item: OportunidadeDetalhe;
  allPhotos: string[];
  onOpenLightbox: (src: string) => void;
  onOpenAlbum: () => void;
};

export default function PropertyGallery({ item, allPhotos, onOpenLightbox, onOpenAlbum }: Props) {
  const { t } = useTranslation();

  return (
    <>
      <div className={`pi-gallery ${(!item.gallery.sideTop || !item.gallery.sideBottom) ? 'pi-gallery--single' : ''}`}>
        <span className="pi-pill">{item.badge}</span>
        <img
          src={item.gallery.main}
          alt={`Destaque de ${item.propertyTitle}`}
          className="pi-image-main pi-zoomable"
          onClick={() => onOpenLightbox(item.gallery.main)}
        />
        {item.gallery.sideTop && (
          <img
            src={item.gallery.sideTop}
            alt={`Imagem complementar de ${item.propertyTitle}`}
            className="pi-image-side-top pi-zoomable"
            onClick={() => onOpenLightbox(item.gallery.sideTop)}
          />
        )}
        {item.gallery.sideBottom && (
          <img
            src={item.gallery.sideBottom}
            alt={`Mapa e dados de ${item.propertyTitle}`}
            className="pi-image-side-bottom pi-zoomable"
            onClick={() => onOpenLightbox(item.gallery.sideBottom)}
          />
        )}
      </div>

      {item.gallery.extra && item.gallery.extra.length > 0 && (
        <div className="pi-gallery-secondary">
          {item.gallery.extra.slice(0, 3).map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Galeria ${idx + 4} de ${item.propertyTitle}`}
              className="pi-image-secondary pi-zoomable"
              onClick={() => onOpenLightbox(img)}
            />
          ))}
        </div>
      )}

      {allPhotos.length > 1 && (
        <button className="pi-gallery-strip" onClick={onOpenAlbum} aria-label="Abrir galeria de fotos">
          <div className="pi-gallery-strip-previews">
            {allPhotos.slice(0, 5).map((src, idx) => (
              <div key={idx} className="pi-gallery-strip-thumb">
                <img src={src} alt={`Preview ${idx + 1}`} />
                {idx === 4 && allPhotos.length > 5 && (
                  <div className="pi-gallery-strip-more">
                    <span>+{allPhotos.length - 5}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="pi-gallery-strip-cta">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <span className="pi-gallery-strip-label">{t('oportunidades.viewAllPhotos')}</span>
            <span className="pi-gallery-strip-count">{allPhotos.length} fotos</span>
          </div>
        </button>
      )}
    </>
  );
}
