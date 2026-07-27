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
