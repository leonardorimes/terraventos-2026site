// Fase 5.1 — varre TODO public/ (exceto imoveis/ e documentos/, já migrados) e monta um
// manifesto (JSON) de oldPath -> newPath com nomes contextuais/limpos, sem tocar em disco.
// Revisar o manifesto ANTES de rodar scripts/apply-image-rename.mjs.
// Uso: npx tsx scripts/build-full-image-manifest.mjs [caminho-de-saida.json]
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const publicDir = path.join(root, 'public');

const SKIP_DIRS = new Set(['imoveis', 'documentos']);
const IMAGE_EXT = /\.(jpe?g|png|webp|avif|gif)$/i;

// Arquivos-fonte varridos para saber quais imagens já são referenciadas pelo código
// (referenciadas => a renomeação precisa reescrever a referência junto). Varre TODO
// src/**/*.{ts,tsx} + generate-static.mjs + index.html + public/**/*.html — uma lista
// fixa de arquivos é frágil (fácil esquecer um componente novo que referencia imagem).
function collectTextFiles(dir, exts, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectTextFiles(abs, exts, out);
    } else if (exts.some((ext) => entry.name.endsWith(ext))) {
      out.push(abs);
    }
  }
  return out;
}

const TEXT_FILES = [
  ...collectTextFiles(path.join(root, 'src'), ['.ts', '.tsx', '.css']),
  ...collectTextFiles(publicDir, ['.html']),
  path.join(root, 'generate-static.mjs'),
  path.join(root, 'index.html'),
];

const referencedPaths = new Set();
for (const f of TEXT_FILES) {
  if (!fs.existsSync(f)) continue;
  const content = fs.readFileSync(f, 'utf8');
  const reRelative = /["'`(]\/([^"'`)]+\.(?:jpe?g|png|webp|avif|gif))["'`)]/gi;
  let m;
  while ((m = reRelative.exec(content))) referencedPaths.add('/' + decodeURIComponent(m[1]));
  const reAbsolute = /https:\/\/terraventos\.com(\/[^"'`)]+\.(?:jpe?g|png|webp|avif|gif))/gi;
  while ((m = reAbsolute.exec(content))) referencedPaths.add(decodeURIComponent(m[1]));
}

// Normaliza acentos/espaços/pontuação/camelCase para um slug ascii limpo, kebab-case.
// Ex: "CasadeAltoPadraonaPraiadaBarrinha" -> "casade-alto-padraona-praia-da-barrinha"
function slugify(input) {
  return input
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2') // separa limites de camelCase antes de baixar a caixa
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // remove diacríticos (á -> a, ç -> c, etc.)
    .replace(/[ºª²³]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function collectImageFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue; // .comments, .DS_Store etc.
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectImageFiles(abs, out);
    } else if (IMAGE_EXT.test(entry.name)) {
      out.push(abs);
    }
  }
  return out;
}

const allFiles = [];
for (const entry of fs.readdirSync(publicDir, { withFileTypes: true })) {
  if (SKIP_DIRS.has(entry.name) || entry.name.startsWith('.')) continue;
  const abs = path.join(publicDir, entry.name);
  if (entry.isDirectory()) {
    collectImageFiles(abs, allFiles);
  } else if (IMAGE_EXT.test(entry.name)) {
    allFiles.push(abs);
  }
}

// Agrupa por "pasta-alvo" — caminho completo de subpastas (relativo a public/), slugificado
// segmento a segmento e unido, para não colidir quando pastas diferentes têm uma subpasta
// de mesmo nome (ex: várias "extracted/" dentro de pastas de imóveis distintas). Arquivos
// soltos na raiz de public/ mantêm-se na raiz, só com o nome normalizado.
const groups = new Map(); // targetFolderSlug -> [{abs, relPath, oldName}]
for (const abs of allFiles) {
  const relFromPublic = '/' + path.relative(publicDir, abs).split(path.sep).join('/');
  const parentDir = path.dirname(abs);
  const isRootFile = parentDir === publicDir;
  const relDirSegments = path.relative(publicDir, parentDir).split(path.sep).filter(Boolean);
  // Descarta segmentos que são só ruído de exportação do WhatsApp (ex: pasta extraída de um
  // zip chamada "WhatsApp Unknown 2026-07-14 at 16.58.40") — não agregam contexto real.
  const meaningfulSegments = relDirSegments.filter((seg) => !/^whatsapp\b/i.test(seg));
  const segmentsForKey = meaningfulSegments.length > 0 ? meaningfulSegments : relDirSegments;
  const groupKey = isRootFile ? '__root__' : segmentsForKey.map(slugify).filter(Boolean).join('-');
  if (!groups.has(groupKey)) groups.set(groupKey, []);
  groups.get(groupKey).push({ abs, relPath: relFromPublic, oldName: path.basename(abs) });
}

const manifest = [];
for (const [groupKey, files] of groups) {
  // Ordem estável (natural, preserva sequência original tipo WhatsApp timestamp/DJI seq)
  files.sort((a, b) => a.oldName.localeCompare(b.oldName, 'pt-BR', { numeric: true }));

  files.forEach((f, idx) => {
    const referenced = referencedPaths.has(f.relPath);
    const rawExt = path.extname(f.oldName); // preserva a caixa original p/ strip correto (ex: .JPG)
    const ext = rawExt.toLowerCase();
    let newRelPath;
    if (groupKey === '__root__') {
      // arquivo solto na raiz de public/: mantém no lugar, só normaliza o próprio nome
      const base = slugify(path.basename(f.oldName, rawExt)) || `imagem-${idx + 1}`;
      newRelPath = `/${base}${ext}`;
    } else {
      const seq = files.length > 1 ? `-${String(idx + 1).padStart(2, '0')}` : '';
      newRelPath = `/${groupKey}/${groupKey}${seq}${ext}`;
    }

    const alreadyClean = newRelPath === f.relPath;
    manifest.push({
      oldPath: f.relPath,
      newPath: newRelPath,
      referencedInCode: referenced,
      // referenciada -> pode reconverter formato (webp/avif) com segurança, é usada no site.
      // não referenciada -> só renomeia (sem reencode), evita I/O caro em pastas mortas.
      suggestedAction: alreadyClean ? 'skip' : referenced ? 'rename-and-convert' : 'rename-only',
      sizeBytes: fs.statSync(f.abs).size,
    });
  });
}

const outPath = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(root, 'scripts', '.image-rename-manifest.json');
fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2));

const counts = manifest.reduce((acc, m) => {
  acc[m.suggestedAction] = (acc[m.suggestedAction] || 0) + 1;
  return acc;
}, {});
const totalBytes = manifest
  .filter((m) => m.suggestedAction !== 'skip')
  .reduce((sum, m) => sum + m.sizeBytes, 0);

console.log(`Manifesto gerado: ${manifest.length} imagens fora de /imoveis e /documentos.`);
console.log('Por ação:', counts);
console.log(`Tamanho total a mexer: ${(totalBytes / 1024 / 1024).toFixed(1)} MB`);
console.log(`Salvo em: ${outPath}`);
