export interface UnsplashPhoto {
  id: string;
  description: string | null;
  urls: { thumb: string; small: string; regular: string };
  width: number;
  height: number;
  photographerName: string;
  photographerProfileUrl: string;
  downloadLocation: string;
}

interface UnsplashApiPhoto {
  id: string;
  description: string | null;
  alt_description: string | null;
  width: number;
  height: number;
  urls: { thumb: string; small: string; regular: string };
  user: { name: string; links: { html: string } };
  links: { download_location: string };
}

interface UnsplashSearchResponse {
  results: UnsplashApiPhoto[];
  total_pages: number;
}

const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY as string | undefined;

export function isUnsplashConfigured(): boolean {
  return !!ACCESS_KEY;
}

function toPhoto(raw: UnsplashApiPhoto): UnsplashPhoto {
  return {
    id: raw.id,
    description: raw.description || raw.alt_description,
    urls: raw.urls,
    width: raw.width,
    height: raw.height,
    photographerName: raw.user.name,
    photographerProfileUrl: `${raw.user.links.html}?utm_source=terra_ventos&utm_medium=referral`,
    downloadLocation: raw.links.download_location,
  };
}

export async function searchUnsplashPhotos(
  query: string,
  page = 1,
): Promise<{ photos: UnsplashPhoto[]; totalPages: number }> {
  if (!ACCESS_KEY) {
    throw new Error('VITE_UNSPLASH_ACCESS_KEY não configurada.');
  }

  const url = new URL('https://api.unsplash.com/search/photos');
  url.searchParams.set('query', query);
  url.searchParams.set('page', String(page));
  url.searchParams.set('per_page', '5');
  url.searchParams.set('orientation', 'landscape');

  const response = await fetch(url.toString(), {
    headers: { Authorization: `Client-ID ${ACCESS_KEY}` },
  });
  if (!response.ok) {
    throw new Error(`Busca no Unsplash falhou (${response.status})`);
  }

  const data: UnsplashSearchResponse = await response.json();
  return { photos: data.results.map(toPhoto), totalPages: data.total_pages };
}

/**
 * Exigência das diretrizes da API do Unsplash: toda vez que uma foto é usada
 * (hotlink ou download), é preciso avisar o endpoint de download deles.
 */
export async function trackUnsplashDownload(downloadLocation: string): Promise<void> {
  if (!ACCESS_KEY) return;
  try {
    await fetch(downloadLocation, { headers: { Authorization: `Client-ID ${ACCESS_KEY}` } });
  } catch {
    // Falha ao registrar não deve bloquear o fluxo do admin.
  }
}
