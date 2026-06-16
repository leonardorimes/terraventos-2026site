const fs = require('fs');
const path = require('path');

const dir = 'public/mansoes';
const allFiles = fs.readdirSync(dir);
const images = allFiles
  .filter(f => f.endsWith('.jpg') || f.endsWith('.png') || f.endsWith('.webp'))
  .filter(f => f !== 'cover.png') // ignore cover.png completely
  .sort()
  .map(f => `/mansoes/${f}`);

const mainImage = images[0] || '';
const sideTop = images.length > 1 ? images[1] : '';
const sideBottom = images.length > 2 ? images[2] : '';
const extra = images.slice(3);

console.log(`Setting main image to ${mainImage}`);

// 1. properties-data.json
const jsonPath = 'public/properties-data.json';
let data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const propIndex = data.findIndex(p => p.id === '13');
if (propIndex !== -1) {
  data[propIndex].image = mainImage;
  data[propIndex].gallery.main = mainImage;
  data[propIndex].gallery.sideTop = sideTop;
  data[propIndex].gallery.sideBottom = sideBottom;
  data[propIndex].gallery.extra = extra;
  
  if (data[propIndex].i18n) {
    for (const lang in data[propIndex].i18n) {
       data[propIndex].i18n[lang].image = mainImage;
       data[propIndex].i18n[lang].gallery.main = mainImage;
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
  
  // Replace the image property
  // e.g. image: '/mansoes/cover.png',
  content = content.replace(/image:\s*'\/mansoes\/cover\.png'/g, `image: '${mainImage}'`);
  content = content.replace(/image:\s*"\/mansoes\/cover\.png"/g, `image: '${mainImage}'`);
  
  // For gallery, it's safer to just replace the main: '/mansoes/cover.png'
  content = content.replace(/main:\s*'\/mansoes\/cover\.png'/g, `main: '${mainImage}'`);
  content = content.replace(/main:\s*"\/mansoes\/cover\.png"/g, `main: '${mainImage}'`);
  
  // But wait, the previous script might have already replaced sideTop with the old mainImage.
  // It's tricky to regex replace the whole gallery object again because sideTop is now a dynamic string.
  // Let's use a robust replace for the gallery block of ID 13.
  // We can just rely on the JSON for the frontend, but we should keep TS consistent.
  fs.writeFileSync(filePath, content);
}

updateTsFile('src/data/oportunidadesDataI18n.ts');
updateTsFile('src/data/oportunidadesData.ts');

// 3. Update ProjetosDestaque.tsx
const destaquePath = 'src/components/ProjetosDestaque.tsx';
let destaqueContent = fs.readFileSync(destaquePath, 'utf8');
destaqueContent = destaqueContent.replace(/\/mansoes\/cover\.png/g, mainImage);
fs.writeFileSync(destaquePath, destaqueContent);

console.log('Updated successfully.');
