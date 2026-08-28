// Gera uma versão 1200x630 (proporção 1.91:1, padrão og:image) de cada imagem hoje usada
// como preview social — WhatsApp/Instagram/Facebook cortam ou colocam tarja em imagens fora
// dessa proporção. Não mexe na imagem original usada dentro do site, só cria uma variante
// paralela em public/og/, espelhando o mesmo caminho relativo (sempre .webp).
// Uso: npx tsx scripts/generate-og-images.mjs
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getOportunidadesData } from '../src/data/oportunidadesDataI18n.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const publicDir = path.join(root, 'public');
const ogDir = path.join(publicDir, 'og');

const sources = new Set();
for (const item of getOportunidadesData('pt')) {
  sources.add(item.image);
}
// Fixos: hero do Taíba, banner da home, fallback institucional, logo do founders,
// hero da landing page de Tatajuba (Preá e Bitupitá já entram via item.image, acima)
sources.add('/imoveis/lote-barramar-lagoa-taiba-03.webp');
sources.add('/banners/banners-01.webp');
sources.add('/og-propriedades.png');
sources.add('/founders/founders.png');
sources.add('/imoveis/area-exclusiva-tatajuba-guriu-100000m-01.webp');

console.log(`Gerando og:image (1200x630) para ${sources.size} fontes únicas...`);

let ok = 0;
let missing = 0;

for (const relPath of sources) {
  const srcAbs = path.join(publicDir, relPath.replace(/^\//, ''));
  if (!fs.existsSync(srcAbs)) {
    console.warn('MISSING, pulando:', relPath);
    missing++;
    continue;
  }
  const targetRel = relPath.replace(/\.[^.]+$/, '.webp');
  const targetAbs = path.join(ogDir, targetRel.replace(/^\//, ''));
  fs.mkdirSync(path.dirname(targetAbs), { recursive: true });

  await sharp(srcAbs)
    .resize(1200, 630, { fit: 'cover', position: 'attention' })
    .webp({ quality: 85 })
    .toFile(targetAbs);
  ok++;
}

console.log(`Concluído: ${ok} imagens geradas em public/og/, ${missing} ausentes.`);
