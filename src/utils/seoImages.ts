// Crawlers de preview social (WhatsApp, Instagram, Facebook) têm suporte inconsistente a
// AVIF — og:image/twitter:image nunca deve apontar para um .avif, mesmo que a própria página
// use avif normalmente. Função pura (roda tanto no gerador Node quanto no browser), então não
// pode checar o disco: assume a convenção do projeto de que todo .avif tem um par .webp com o
// mesmo nome-base (é o que os scripts de conversão em scripts/ sempre produzem).
export function toSocialSafeImage(imagePath: string): string {
  if (/\.avif$/i.test(imagePath)) {
    return imagePath.replace(/\.avif$/i, '.webp');
  }
  return imagePath;
}

// og:image/twitter:image precisa ser 1200x630 (1.91:1) — as fotos reais dos imóveis são quase
// quadradas ou 16:9, e ficam cortadas/com tarja no card de preview. scripts/generate-og-images.mjs
// pré-gera um recorte 1200x630 de cada imagem usada como capa em public/og/, espelhando o mesmo
// caminho (sempre .webp, resolve de quebra o problema do avif também). URLs remotas (ex: thumbnail
// de vídeo do Vimeo) não têm variante gerada — passam direto.
export function toOgImage(imagePath: string): string {
  if (/^https?:\/\//i.test(imagePath)) {
    return imagePath;
  }
  return `/og${imagePath.replace(/\.[^./]+$/, '.webp')}`;
}
