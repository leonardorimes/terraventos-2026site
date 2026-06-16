import fs from 'fs';

const galleryFile = '/tmp/gallery.json';
const dataFile = './src/data/oportunidadesData.ts';
const i18nFile = './src/data/oportunidadesDataI18n.ts';

const extraArray = JSON.parse(fs.readFileSync(galleryFile, 'utf8'));
const extraStr = 'extra: [\n        ' + extraArray.map(item => `'${item}'`).join(',\n        ') + '\n      ]';

const newMain = '/terra_ventos_house/compressed/Terra Ventos House - Conduru 3 - Formato Paisagem - Foto Thiago Faquineli -1.webp';
const newSideTop = '/terra_ventos_house/compressed/Terra Ventos House - Conduru 3 - Formato Paisagem - Foto Thiago Faquineli -2.webp';
const newSideBottom = '/terra_ventos_house/compressed/Terra Ventos House - Conduru 3 - Formato Paisagem - Foto Thiago Faquineli -3.webp';

function processBlock(block, locale) {
  // Replace main image
  block = block.replace(/image:\s*'.*?'/, `image: '${newMain}'`);
  
  // Replace gallery
  const galleryRegex = /gallery:\s*\{[\s\S]*?\},/;
  const newGallery = `gallery: {
      main: '${newMain}',
      sideTop: '${newSideTop}',
      sideBottom: '${newSideBottom}',
      ${extraStr}
    },`;
  block = block.replace(galleryRegex, newGallery);

  // Add videoSources after mapUrl if not exists
  if (!block.includes('videoSources')) {
    const videoSources = `videoSources: [
      "https://player.vimeo.com/video/1201808506",
      "https://player.vimeo.com/video/1201808597",
      "https://player.vimeo.com/video/1201808664"
    ],`;
    block = block.replace(/(mapUrl:\s*'.*?',)/, `$1\n    ${videoSources}`);
  }

  // ALUGUEL specific fixes
  if (locale === 'pt') {
    block = block.replace(/title:\s*'TEMPORADA'/, "title: 'ALUGUEL'");
    block = block.replace(/badge:\s*'Temporada'/, "badge: 'Aluguel de Temporada'");
    block = block.replace(/propertyTitle:\s*'(.*?)'/, "propertyTitle: '$1 (ALUGUEL)'");
    block = block.replace(/exclusiveText:\s*'(.*?)'/, "exclusiveText: 'ALUGUEL DE TEMPORADA $1'");
  } else if (locale === 'en') {
    block = block.replace(/title:\s*'STAY'/, "title: 'RENTAL'");
    block = block.replace(/badge:\s*'Stay'/, "badge: 'Vacation Rental'");
    block = block.replace(/propertyTitle:\s*'(.*?)'/, "propertyTitle: '$1 (RENTAL)'");
    block = block.replace(/exclusiveText:\s*'(.*?)'/, "exclusiveText: 'VACATION RENTAL $1'");
  } else if (locale === 'es') {
    block = block.replace(/title:\s*'ESTANCIA'/, "title: 'ALQUILER'");
    block = block.replace(/badge:\s*'Estancia'/, "badge: 'Alquiler Vacacional'");
    block = block.replace(/propertyTitle:\s*'(.*?)'/, "propertyTitle: '$1 (ALQUILER)'");
    block = block.replace(/exclusiveText:\s*'(.*?)'/, "exclusiveText: 'ALQUILER VACACIONAL $1'");
  }

  return block;
}

function updateFile(filePath, isI18n) {
  let content = fs.readFileSync(filePath, 'utf8');

  // We need to split the file by the "slug: 'villa-condudu-3'" and handle each block.
  // In oportunidadesData.ts, it's just one block.
  // In oportunidadesDataI18n.ts, there are three blocks (pt, en, es).

  let blocks = content.split(/(slug:\s*'villa-condudu-3'.*?\n)/);
  
  if (!isI18n && blocks.length === 3) {
    // [0] is before, [1] is the slug line, [2] is the rest
    // The property object ends at the next `  },`
    let propertyBlockEnd = blocks[2].indexOf('    priceTag:');
    if (propertyBlockEnd !== -1) {
      let head = blocks[0] + blocks[1];
      let propBlock = blocks[2].substring(0, propertyBlockEnd);
      let tail = blocks[2].substring(propertyBlockEnd);
      
      propBlock = processBlock(propBlock, 'pt');
      
      fs.writeFileSync(filePath, head + propBlock + tail, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  } else if (isI18n && blocks.length === 7) {
    // 3 blocks
    let locales = ['pt', 'en', 'es'];
    
    for (let i = 0; i < 3; i++) {
      let slugIndex = i * 2 + 1;
      let blockIndex = i * 2 + 2;
      
      let propertyBlockEnd = blocks[blockIndex].indexOf('      priceTag:');
      
      if (propertyBlockEnd !== -1) {
        let propBlock = blocks[blockIndex].substring(0, propertyBlockEnd);
        let tail = blocks[blockIndex].substring(propertyBlockEnd);
        
        propBlock = processBlock(propBlock, locales[i]);
        
        blocks[blockIndex] = propBlock + tail;
      }
    }
    
    fs.writeFileSync(filePath, blocks.join(''), 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

updateFile(dataFile, false);
updateFile(i18nFile, true);
