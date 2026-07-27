// One-off migration: rename messy property image filenames (spaces, commas,
// WhatsApp/DJI camera-export names) into clean slug-based names under
// public/imoveis/, standardizing format to webp (keeping already-webp/avif
// files as-is). Rewrites every live reference across the 6 source files that
// hold image paths. Run with: npx tsx scripts/migrate-property-images.mjs
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { oportunidadesData } from '../src/data/oportunidadesData.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const publicDir = path.join(root, 'public');
const imoveisDir = path.join(publicDir, 'imoveis');

const TEXT_FILES = [
  'src/data/oportunidadesData.ts',
  'src/data/oportunidadesDataI18n.ts',
  'src/components/PaginaTaiba.tsx',
  'src/components/VillaCondudu.tsx',
  'src/components/ProjetosDestaque.tsx',
  'src/components/ListagemPropriedades.tsx',
].map((p) => path.join(root, p));

function isImagePath(p) {
  if (typeof p !== 'string') return false;
  if (/^https?:\/\//i.test(p)) return false; // remote URL (e.g. Vimeo thumbnail proxy), not a local file
  return /\.(jpe?g|png|webp|avif|gif)$/i.test(p);
}

// manifest: oldPath (as written in source, leading slash) -> { slug, seq }
const manifest = new Map();
const slugCounters = new Map();

function addImage(slug, oldPath) {
  if (!isImagePath(oldPath)) return;
  if (manifest.has(oldPath)) return; // same file already assigned a new name
  const seq = (slugCounters.get(slug) || 0) + 1;
  slugCounters.set(slug, seq);
  manifest.set(oldPath, { slug, seq });
}

// 1. Master data — every property's own photos (never mapImage: shared /mapa.avif, out of scope)
for (const item of oportunidadesData) {
  addImage(item.slug, item.image);
  addImage(item.slug, item.gallery.main);
  addImage(item.slug, item.gallery.sideTop);
  addImage(item.slug, item.gallery.sideBottom);
  (item.gallery.extra || []).forEach((p) => addImage(item.slug, p));
  (item.documents || []).forEach((d) => addImage(item.slug, d.url));
}

// 2. Known hardcoded extras living outside oportunidadesData.ts (see plan doc)
addImage('taiba-lote-109', '/taiba/lote109_img-000.jpg');
addImage('taiba-lote-109', '/taiba/lote109_img-001.jpg');
addImage('taiba-barramar-720m', '/taiba/barramar720_img-000.jpg');
addImage('taiba-barramar-720m', '/taiba/barramar720_img-001.jpg');
addImage('taiba-hero', '/taiba/Picture.png');
addImage('villa-conduru-3-homepage', '/VillaCondutuPaginaInicial/Final 01 (2).png');
addImage('villa-conduru-3-homepage', '/VillaCondutuPaginaInicial/FINAL 02 (1).png');
addImage('terreno-exclusivo-tatajuba-1000m-homepage', '/TATAJUBA/WhatsApp Image 2026-04-23 at 18.35.22.jpeg');
addImage('prea-house-homepage', '/Prea House/WhatsApp Image 2026-04-20 at 09.12.53.jpeg');
addImage('villa-prabhu-homepage', '/VILLA_PRABHU/WhatsApp Image 2026-04-01 at 14.58.56 (3).jpeg');

console.log(`Manifest built: ${manifest.size} unique property images across ${slugCounters.size} slugs.`);

const DRY_RUN = process.env.DRY_RUN === '1';

async function migrate() {
  if (DRY_RUN) {
    let missing = 0;
    for (const [oldPath, { slug, seq }] of manifest) {
      const oldAbs = path.join(publicDir, decodeURIComponent(oldPath).replace(/^\//, ''));
      const exists = fs.existsSync(oldAbs);
      if (!exists) missing++;
      console.log(`${exists ? 'OK  ' : 'MISS'} ${oldPath}  ->  /imoveis/${slug}-${String(seq).padStart(2, '0')}.<ext>`);
    }
    console.log(`\nDRY RUN — ${manifest.size} images would be processed, ${missing} missing on disk.`);
    return;
  }

  fs.mkdirSync(imoveisDir, { recursive: true });
  const renameMap = new Map(); // oldPath -> new public path (/imoveis/...)
  const oldFilesToDelete = [];
  let reencoded = 0;
  let copied = 0;
  let missing = 0;

  for (const [oldPath, { slug, seq }] of manifest) {
    const relFsPath = decodeURIComponent(oldPath).replace(/^\//, '');
    const oldAbs = path.join(publicDir, relFsPath);
    if (!fs.existsSync(oldAbs)) {
      console.warn('MISSING FILE, skipping:', oldPath);
      missing++;
      continue;
    }

    let ext = '.webp';
    let reencode = true;
    try {
      const meta = await sharp(oldAbs).metadata();
      if (meta.format === 'webp') {
        ext = '.webp';
        reencode = false;
      } else if (meta.format === 'avif') {
        ext = '.avif';
        reencode = false;
      }
    } catch (e) {
      console.error('Failed to read metadata for', oldPath, '-', e.message);
      continue;
    }

    const newFilename = `${slug}-${String(seq).padStart(2, '0')}${ext}`;
    const newAbs = path.join(imoveisDir, newFilename);

    try {
      if (reencode) {
        await sharp(oldAbs)
          .resize(1920, null, { withoutEnlargement: true })
          .webp({ quality: 80 })
          .toFile(newAbs);
        reencoded++;
      } else {
        fs.copyFileSync(oldAbs, newAbs);
        copied++;
      }
    } catch (e) {
      console.error('Failed to convert', oldPath, '-', e.message);
      continue;
    }

    renameMap.set(oldPath, `/imoveis/${newFilename}`);
    oldFilesToDelete.push(oldAbs);
  }

  console.log(`Converted: ${reencoded} re-encoded to webp, ${copied} copied as-is, ${missing} missing.`);

  for (const file of TEXT_FILES) {
    let content = fs.readFileSync(file, 'utf8');
    let changedCount = 0;
    for (const [oldPath, newPath] of renameMap) {
      if (content.includes(oldPath)) {
        content = content.split(oldPath).join(newPath);
        changedCount++;
      }
    }
    if (changedCount > 0) {
      fs.writeFileSync(file, content);
      console.log(`Updated ${changedCount} reference(s) in ${path.relative(root, file)}`);
    }
  }

  for (const oldAbs of oldFilesToDelete) {
    fs.unlinkSync(oldAbs);
  }
  console.log(`Deleted ${oldFilesToDelete.length} old files.`);

  function removeEmptyDirs(dir) {
    if (!fs.existsSync(dir) || dir === publicDir || dir === imoveisDir) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      if (e.isDirectory()) removeEmptyDirs(path.join(dir, e.name));
    }
    if (fs.readdirSync(dir).length === 0) {
      fs.rmdirSync(dir);
      console.log('Removed empty dir:', path.relative(root, dir));
    }
  }
  const touchedDirs = new Set(oldFilesToDelete.map((p) => path.dirname(p)));
  for (const d of touchedDirs) removeEmptyDirs(d);

  console.log(`Done. ${manifest.size} unique images processed.`);
}

migrate();
