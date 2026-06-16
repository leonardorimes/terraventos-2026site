const fs = require('fs');

// 1. properties-data.json
const jsonPath = 'public/properties-data.json';
let data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const propIndex = data.findIndex(p => p.id === '13');
if (propIndex !== -1) {
  data[propIndex].image = '/mansoes/cover.png';
  data[propIndex].gallery.main = '/mansoes/cover.png';
  data[propIndex].gallery.sideTop = null;
  data[propIndex].gallery.sideBottom = null;
  data[propIndex].gallery.extra = [];
  
  // Update i18n inside json
  if (data[propIndex].i18n) {
    for (const lang in data[propIndex].i18n) {
       data[propIndex].i18n[lang].image = '/mansoes/cover.png';
       data[propIndex].i18n[lang].gallery = {
          main: '/mansoes/cover.png',
          sideTop: null,
          sideBottom: null,
          extra: []
       };
    }
  }
}
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));

// 2. oportunidadesDataI18n.ts
let tsContent = fs.readFileSync('src/data/oportunidadesDataI18n.ts', 'utf8');
// Replace the block of gallery for id 13
// This is a bit tricky with regex, so we'll just read line by line and if we are in id 13, replace image and gallery.
// Actually, since the file is predictably structured from our previous script, we can just replace the image URL and nullify the others.
tsContent = tsContent.replace(/image: 'https:\/\/vumbnail\.com\/1201412713\.jpg'/g, "image: '/mansoes/cover.png'");
tsContent = tsContent.replace(/main: 'https:\/\/vumbnail\.com\/1201412713\.jpg'/g, "main: '/mansoes/cover.png'");
tsContent = tsContent.replace(/sideTop: 'https:\/\/vumbnail\.com\/1201412789\.jpg'/g, "sideTop: ''");
tsContent = tsContent.replace(/sideBottom: 'https:\/\/vumbnail\.com\/1201412849\.jpg'/g, "sideBottom: ''");
tsContent = tsContent.replace(/extra: \[\s+'https:\/\/vumbnail\.com\/1201412979\.jpg',\s+'https:\/\/vumbnail\.com\/1201413032\.jpg',\s+'https:\/\/vumbnail\.com\/1201413057\.jpg',\s+'https:\/\/vumbnail\.com\/1201413090\.jpg',\s+'https:\/\/vumbnail\.com\/1201413261\.jpg',\s+'https:\/\/vumbnail\.com\/1201412910\.jpg'\s+\]/g, "extra: []");
fs.writeFileSync('src/data/oportunidadesDataI18n.ts', tsContent);

// 3. oportunidadesData.ts
let baseContent = fs.readFileSync('src/data/oportunidadesData.ts', 'utf8');
baseContent = baseContent.replace(/image: 'https:\/\/vumbnail\.com\/1201412713\.jpg'/g, "image: '/mansoes/cover.png'");
baseContent = baseContent.replace(/main: 'https:\/\/vumbnail\.com\/1201412713\.jpg'/g, "main: '/mansoes/cover.png'");
baseContent = baseContent.replace(/sideTop: 'https:\/\/vumbnail\.com\/1201412789\.jpg'/g, "sideTop: ''");
baseContent = baseContent.replace(/sideBottom: 'https:\/\/vumbnail\.com\/1201412849\.jpg'/g, "sideBottom: ''");
baseContent = baseContent.replace(/extra: \[\s+'https:\/\/vumbnail\.com\/1201412979\.jpg',\s+'https:\/\/vumbnail\.com\/1201413032\.jpg',\s+'https:\/\/vumbnail\.com\/1201413057\.jpg',\s+'https:\/\/vumbnail\.com\/1201413090\.jpg',\s+'https:\/\/vumbnail\.com\/1201413261\.jpg',\s+'https:\/\/vumbnail\.com\/1201412910\.jpg'\s+\]/g, "extra: []");
fs.writeFileSync('src/data/oportunidadesData.ts', baseContent);

console.log("Images updated");
