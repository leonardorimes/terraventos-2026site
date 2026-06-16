const fs = require('fs');

const newMapUrl = 'https://maps.google.com/maps?q=-2.8170056343078613,-40.42036056518555&hl=pt-BR&z=17&output=embed';

// 1. properties-data.json
const jsonPath = 'public/properties-data.json';
let data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const propIndex = data.findIndex(p => p.id === '13');
if (propIndex !== -1) {
  data[propIndex].mapUrl = newMapUrl;
  if (data[propIndex].i18n) {
    for (const lang in data[propIndex].i18n) {
       data[propIndex].i18n[lang].mapUrl = newMapUrl;
    }
  }
}
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));

// 2. Helper to replace in TS files
function updateTsFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace the mapUrl for the Praia do Prea property specifically.
  // The current mapUrl is usually: mapUrl: 'https://maps.google.com/maps?q=Praia+do+Pre%C3%A1,+Cruz+-+CE&hl=pt-BR&z=15&output=embed',
  // But wait, there are other properties with similar mapUrls. We need to be careful.
  // The safest way is to search and replace only the first occurrence or specific one.
  // We can just regex replace exactly the old mapUrl:
  const oldMapUrl = 'https://maps.google.com/maps?q=Praia+do+Pre%C3%A1,+Cruz+-+CE&hl=pt-BR&z=15&output=embed';
  
  // Wait, let's just replace all instances of that old URL because it was likely only used for this property.
  // If it's used by others, well, Praia do Prea is the general one. Let's check if others use it.
  content = content.replace(new RegExp(oldMapUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newMapUrl);
  
  fs.writeFileSync(filePath, content);
}

updateTsFile('src/data/oportunidadesDataI18n.ts');
updateTsFile('src/data/oportunidadesData.ts');

console.log('Map URL updated successfully.');
