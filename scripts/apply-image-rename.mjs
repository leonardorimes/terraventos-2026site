// Fase 5.2 — aplica o manifesto gerado por build-full-image-manifest.mjs:
//   - 'rename-only'        -> só move/renomeia o arquivo, sem reencode (pastas não usadas
//                              pelo site hoje; reconverter seria I/O caro sem ganho real).
//   - 'rename-and-convert' -> reencoda para webp preservando PNG apenas onde há transparência
//                              real (canal alpha com variação de fato, não só "tem 4 canais"),
//                              mantém webp/avif já otimizados como estão.
// Reescreve as referências nos arquivos-fonte (find-and-replace programático) e só apaga o
// arquivo antigo depois de confirmar que o novo foi escrito com sucesso.
// Uso: DRY_RUN=1 npx tsx scripts/apply-image-rename.mjs   (revisão sem tocar em disco)
//      npx tsx scripts/apply-image-rename.mjs             (aplica de verdade)
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const publicDir = path.join(root, 'public');
const manifestPath = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(root, 'scripts', '.image-rename-manifest.json');

if (!fs.existsSync(manifestPath)) {
  console.error(`Manifesto não encontrado em ${manifestPath}. Rode build-full-image-manifest.mjs primeiro.`);
  process.exit(1);
}
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')).filter(
  (m) => m.suggestedAction !== 'skip',
);

const DRY_RUN = process.env.DRY_RUN === '1';

function collectTextFiles(dir, exts, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) collectTextFiles(abs, exts, out);
    else if (exts.some((ext) => entry.name.endsWith(ext))) out.push(abs);
  }
  return out;
}
const TEXT_FILES = [
  ...collectTextFiles(path.join(root, 'src'), ['.ts', '.tsx', '.css']),
  ...collectTextFiles(publicDir, ['.html']),
  path.join(root, 'generate-static.mjs'),
  path.join(root, 'index.html'),
];

// PNG "tem transparência real" quando o canal alpha existe E varia (min < 255) —
// simplesmente ter 4 canais não basta, muita exportação salva alpha 100% opaco.
async function hasRealTransparency(absPath) {
  const meta = await sharp(absPath).metadata();
  if (!meta.hasAlpha) return false;
  const stats = await sharp(absPath).stats();
  const alphaChannel = stats.channels[stats.channels.length - 1];
  return alphaChannel.min < 255;
}

async function resolveTarget(absPath, manifestExt) {
  const meta = await sharp(absPath).metadata();
  if (meta.format === 'webp') return { ext: '.webp', reencode: false };
  if (meta.format === 'avif') return { ext: '.avif', reencode: false };
  if (meta.format === 'png' && (await hasRealTransparency(absPath))) {
    return { ext: '.png', reencode: true, keepPng: true };
  }
  return { ext: '.webp', reencode: true, keepPng: false };
}

async function run() {
  let renamed = 0;
  let converted = 0;
  let missing = 0;
  const renameMap = new Map(); // oldPath (referenciado) -> newPath final
  const oldFilesToDelete = [];

  for (const entry of manifest) {
    const oldAbs = path.join(publicDir, decodeURIComponent(entry.oldPath).replace(/^\//, ''));
    if (!fs.existsSync(oldAbs)) {
      console.warn('MISSING, pulando:', entry.oldPath);
      missing++;
      continue;
    }

    let finalNewPath = entry.newPath;
    if (entry.suggestedAction === 'rename-and-convert') {
      const { ext } = await resolveTarget(oldAbs, path.extname(entry.newPath));
      finalNewPath = entry.newPath.replace(/\.[^.]+$/, ext);
    }
    const newAbs = path.join(publicDir, decodeURIComponent(finalNewPath).replace(/^\//, ''));

    if (DRY_RUN) {
      console.log(`${entry.suggestedAction === 'rename-and-convert' ? 'CONV' : 'MOVE'} ${entry.oldPath}  ->  ${finalNewPath}`);
      if (entry.referencedInCode) renameMap.set(entry.oldPath, finalNewPath);
      continue;
    }

    fs.mkdirSync(path.dirname(newAbs), { recursive: true });

    try {
      if (entry.suggestedAction === 'rename-and-convert') {
        const { ext, reencode, keepPng } = await resolveTarget(oldAbs);
        const target = path.join(publicDir, decodeURIComponent(entry.newPath.replace(/\.[^.]+$/, ext)).replace(/^\//, ''));
        if (reencode) {
          const pipeline = sharp(oldAbs).resize(1920, null, { withoutEnlargement: true });
          if (keepPng) await pipeline.png({ quality: 85 }).toFile(target);
          else await pipeline.webp({ quality: 80 }).toFile(target);
          converted++;
        } else {
          fs.copyFileSync(oldAbs, target);
          renamed++;
        }
      } else {
        fs.copyFileSync(oldAbs, newAbs);
        renamed++;
      }
    } catch (e) {
      console.error('Falha ao processar', entry.oldPath, '-', e.message);
      continue;
    }

    if (entry.referencedInCode) renameMap.set(entry.oldPath, finalNewPath);
    oldFilesToDelete.push(oldAbs);
  }

  if (DRY_RUN) {
    console.log(`\nDRY RUN — ${manifest.length} entradas, ${missing} ausentes em disco, ${renameMap.size} referências seriam reescritas.`);
    return;
  }

  console.log(`Arquivos: ${renamed} movidos/copiados sem reencode, ${converted} reconvertidos, ${missing} ausentes.`);

  let filesUpdated = 0;
  for (const file of TEXT_FILES) {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;
    for (const [oldPath, newPath] of renameMap) {
      if (content.includes(oldPath)) {
        content = content.split(oldPath).join(newPath);
        changed = true;
      }
    }
    if (changed) {
      fs.writeFileSync(file, content);
      filesUpdated++;
    }
  }
  console.log(`Referências reescritas em ${filesUpdated} arquivo(s)-fonte.`);

  for (const oldAbs of oldFilesToDelete) {
    fs.unlinkSync(oldAbs);
  }
  console.log(`Removidos ${oldFilesToDelete.length} arquivos antigos.`);

  function removeEmptyDirs(dir) {
    if (!fs.existsSync(dir) || dir === publicDir) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      if (e.isDirectory()) removeEmptyDirs(path.join(dir, e.name));
    }
    if (fs.existsSync(dir) && fs.readdirSync(dir).length === 0) {
      fs.rmdirSync(dir);
      console.log('Removida pasta vazia:', path.relative(root, dir));
    }
  }
  const touchedDirs = new Set(oldFilesToDelete.map((p) => path.dirname(p)));
  for (const d of touchedDirs) removeEmptyDirs(d);

  console.log(`Concluído. ${manifest.length} entradas processadas.`);
}

run();
