const fs = require('fs');

let content = fs.readFileSync('generate-static.mjs', 'utf-8');

const pt_11_12 = `
      { slug: 'lote-109-taiba', title: 'LOTE 109 — TAIBA', description: 'Terreno de 560 m² em localização estratégica, totalmente murado e pronto para construir.', image: '/og-propriedades.png' },
      { slug: 'lote-barramar-lagoa-taiba', title: 'LOTE BARRAMAR LAGOA — TAIBA', description: 'Terreno de 800 m² no Loteamento Barramar em Taiba, a apenas 300 metros da Lagoa.', image: '/og-propriedades.png' }
`;
const en_11_12 = `
      { slug: 'lote-109-taiba', title: 'LOTE 109 — TAIBA', description: '560 sqm land in a strategic location, fully walled and ready to build.', image: '/og-propriedades.png' },
      { slug: 'lote-barramar-lagoa-taiba', title: 'BARRAMAR LAGOON LOT — TAIBA', description: '800 sqm land in Barramar, Taiba, just 300 meters from the Lagoon.', image: '/og-propriedades.png' }
`;
const es_11_12 = `
      { slug: 'lote-109-taiba', title: 'LOTE 109 — TAIBA', description: 'Terreno de 560 m² en ubicación estratégica, totalmente amurallado y listo para construir.', image: '/og-propriedades.png' },
      { slug: 'lote-barramar-lagoa-taiba', title: 'LOTE BARRAMAR LAGUNA — TAIBA', description: 'Terreno de 800 m² en Barramar, Taiba, a solo 300 metros de la Laguna.', image: '/og-propriedades.png' }
`;

// Insert them at the end of each properties array.
// For pt:
content = content.replace(/(description: 'Descubra Matanzas Paradise.*?)\n\s*\]/g, (match, p1) => {
  // We need to match the specific languages, let's just do it sequentially by finding the indices
  return match;
});

// A simpler way is just regex on Matanzas since it's the last one for all languages
content = content.replace(/(slug: 'casa-matanzas'[^}]*})/g, "$1," + pt_11_12);

fs.writeFileSync('generate-static.mjs', content);
