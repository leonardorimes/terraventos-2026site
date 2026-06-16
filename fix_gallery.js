const fs = require('fs');
const path = require('path');

const galleryFile = '/tmp/gallery.json';
const dataFile = './src/data/oportunidadesData.ts';
const i18nFile = './src/data/oportunidadesDataI18n.ts';

const extraArray = JSON.parse(fs.readFileSync(galleryFile, 'utf8'));

// Format array as string with proper indentation
const extraStr = 'extra: [\n        ' + extraArray.map(item => `'${item}'`).join(',\n        ') + '\n      ]';

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find the block:
  // sideBottom: '/terra_ventos_house/compressed/Terra Ventos House - Conduru 3 - Formato Paisagem - Foto Thiago Faquineli -3.webp',
  // extra: [ ... ]
  
  // Regex to match the extra array right after sideBottom
  const regex = /(sideBottom:\s*'.*?Thiago Faquineli -3\.webp',\s*)extra:\s*\[[\s\S]*?\](?=\n\s*\})/g;
  
  if (content.match(regex)) {
    content = content.replace(regex, `$1${extraStr}`);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  } else {
    console.log(`Could not find the target block in ${filePath}`);
  }
}

updateFile(dataFile);
updateFile(i18nFile);
