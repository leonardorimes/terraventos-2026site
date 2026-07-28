import { useEffect, useState, type FormEvent } from 'react';
import toast from 'react-hot-toast';
import { isUnsplashConfigured, searchUnsplashPhotos, trackUnsplashDownload, type UnsplashPhoto } from './unsplash';
import './UnsplashPicker.css';

export interface UnsplashSelection {
  url: string;
  creditName: string;
  creditUrl: string;
}

interface UnsplashPickerProps {
  initialQuery?: string;
  onSelect: (selection: UnsplashSelection) => void;
  onClose: () => void;
}

export default function UnsplashPicker({ initialQuery, onSelect, onClose }: UnsplashPickerProps) {
  const [query, setQuery] = useState(initialQuery ?? '');
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectingId, setSelectingId] = useState<string | null>(null);

  const configured = isUnsplashConfigured();

  const runSearch = async (term: string) => {
    if (!term.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const { photos: results } = await searchUnsplashPhotos(term.trim());
      setPhotos(results);
    } catch (err) {
      toast.error('Falha ao buscar no Unsplash.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Sugere automaticamente ao abrir, usando o título do post como busca inicial.
  useEffect(() => {
    if (configured && initialQuery?.trim()) {
      runSearch(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    runSearch(query);
  };

  const handlePick = async (photo: UnsplashPhoto) => {
    setSelectingId(photo.id);
    await trackUnsplashDownload(photo.downloadLocation);
    onSelect({
      url: photo.urls.regular,
      creditName: photo.photographerName,
      creditUrl: photo.photographerProfileUrl,
    });
  };

  return (
    <div className="unsplash-picker-overlay" onClick={onClose}>
      <div className="unsplash-picker" onClick={(event) => event.stopPropagation()}>
        <div className="unsplash-picker-header">
          <h2>Sugestões de fotos</h2>
          <button type="button" className="unsplash-picker-close" onClick={onClose} aria-label="Fechar">
            ×
          </button>
        </div>

        {!configured ? (
          <p className="unsplash-picker-empty">
            Busca do Unsplash não configurada — defina <code>VITE_UNSPLASH_ACCESS_KEY</code> no <code>.env.local</code>.
          </p>
        ) : (
          <>
            <form className="unsplash-picker-search" onSubmit={handleSearch}>
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Ex: kitesurf beach, praia Ceará…"
                autoFocus
              />
              <button type="submit" className="admin-btn admin-btn-primary" disabled={loading}>
                {loading ? 'Buscando…' : 'Buscar'}
              </button>
            </form>

            {loading && <p className="unsplash-picker-empty">Buscando 5 sugestões…</p>}
            {searched && !loading && photos.length === 0 && (
              <p className="unsplash-picker-empty">Nenhum resultado para essa busca.</p>
            )}

            <div className="unsplash-picker-grid">
              {photos.map((photo) => (
                <button
                  key={photo.id}
                  type="button"
                  className="unsplash-picker-item"
                  onClick={() => handlePick(photo)}
                  disabled={selectingId !== null}
                >
                  <img src={photo.urls.small} alt={photo.description || 'Foto do Unsplash'} loading="lazy" />
                  <span className="unsplash-picker-credit">{photo.photographerName}</span>
                  {selectingId === photo.id && <span className="unsplash-picker-picking">Selecionando…</span>}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
