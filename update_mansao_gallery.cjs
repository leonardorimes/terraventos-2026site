const fs = require('fs');
const path = require('path');

const dir = 'public/mansoes';
const allFiles = fs.readdirSync(dir);
const images = allFiles
  .filter(f => f.endsWith('.jpg') || f.endsWith('.png') || f.endsWith('.webp'))
  .filter(f => f !== 'cover.png') // keep cover.png as main
  .sort()
  .map(f => `/mansoes/${f}`);

const sideTop = images.length > 0 ? images[0] : '';
const sideBottom = images.length > 1 ? images[1] : '';
const extra = images.slice(2);

console.log(`Found ${images.length} images.`);

// 1. properties-data.json
const jsonPath = 'public/properties-data.json';
let data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const propIndex = data.findIndex(p => p.id === '13');
if (propIndex !== -1) {
  data[propIndex].gallery.sideTop = sideTop;
  data[propIndex].gallery.sideBottom = sideBottom;
  data[propIndex].gallery.extra = extra;
  
  if (data[propIndex].i18n) {
    for (const lang in data[propIndex].i18n) {
       data[propIndex].i18n[lang].gallery.sideTop = sideTop;
       data[propIndex].i18n[lang].gallery.sideBottom = sideBottom;
       data[propIndex].i18n[lang].gallery.extra = extra;
    }
  }
}
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));

// 2. Helper to replace in TS files
function updateTsFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find id: '13', then find gallery: { ... }, then replace it.
  // Using a regex to match the gallery block for id 13 is tricky because there are multiple id 13s in i18n file (one per lang).
  // But we know exactly how the gallery block looks right now:
  /*
      gallery: {
        main: '/mansoes/cover.png',
        sideTop: '',
        sideBottom: '',
        extra: []
      },
  */
  
  const galleryReplacement = `gallery: {
        main: '/mansoes/cover.png',
        sideTop: '${sideTop}',
        sideBottom: '${sideBottom}',
        extra: ${JSON.stringify(extra)}
      },`;

  // We can just replace the specific string
  const searchStr = `gallery: {
        main: '/mansoes/cover.png',
        sideTop: '',
        sideBottom: '',
        extra: []
      },`;
      
  // Also maybe it was written with single quotes or different spacing
  // Let's use a regex that matches from `gallery: {` to `},` right after `main: '/mansoes/cover.png'`
  
  content = content.replace(/gallery:\s*\{\s*main:\s*'\/mansoes\/cover\.png',\s*sideTop:\s*'[^']*',\s*sideBottom:\s*'[^']*',\s*extra:\s*\[\]\s*\},/g, galleryReplacement);

  fs.writeFileSync(filePath, content);
}

updateTsFile('src/data/oportunidadesDataI18n.ts');
updateTsFile('src/data/oportunidadesData.ts');

console.log('Updated all gallery data successfully.');
