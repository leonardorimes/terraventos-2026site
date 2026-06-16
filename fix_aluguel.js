import fs from 'fs';

const dataFile = './src/data/oportunidadesData.ts';
const i18nFile = './src/data/oportunidadesDataI18n.ts';

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // PT block
  content = content.replace(/slug: 'villa-condudu-3'[\s\S]*?title: 'TEMPORADA'/g, "slug: 'villa-condudu-3', category: 'temporada',\n      title: 'ALUGUEL'");
  content = content.replace(/slug: 'villa-condudu-3',\n\s*title: 'TEMPORADA'/g, "slug: 'villa-condudu-3',\n    title: 'ALUGUEL'");
  
  content = content.replace(/badge: 'Temporada',\n\s*propertyTitle: 'CASA ALTO PADRÃƒO 3 SUÃ TES',\n\s*location: 'FRENTE Ã€ PRAIA DO PREÃ ',\n\s*rating: 5,\n\s*exclusiveText: 'FRENTE Ã€ PRAIA DO PREÃ '/g, "badge: 'Aluguel de Temporada',\n      propertyTitle: 'CASA ALTO PADRÃƒO 3 SUÃ TES (ALUGUEL)',\n      location: 'FRENTE Ã€ PRAIA DO PREÃ ',\n      rating: 5,\n      exclusiveText: 'ALUGUEL DE TEMPORADA FRENTE Ã€ PRAIA DO PREÃ '");
  
  content = content.replace(/badge: 'Temporada',\n\s*propertyTitle: 'CASA ALTO PADRÃO 3 SUÍTES',\n\s*location: 'FRENTE À PRAIA DO PREÁ',\n\s*rating: 5,\n\s*exclusiveText: 'FRENTE À PRAIA DO PREÁ'/g, "badge: 'Aluguel de Temporada',\n      propertyTitle: 'CASA ALTO PADRÃO 3 SUÍTES (ALUGUEL)',\n      location: 'FRENTE À PRAIA DO PREÁ',\n      rating: 5,\n      exclusiveText: 'ALUGUEL DE TEMPORADA FRENTE À PRAIA DO PREÁ'");

  // EN block
  content = content.replace(/slug: 'villa-condudu-3'[\s\S]*?title: 'STAY'/g, "slug: 'villa-condudu-3', category: 'temporada',\n      title: 'RENTAL'");
  content = content.replace(/badge: 'Stay',\n\s*propertyTitle: 'HIGH-END HOUSE 3 SUITES',\n\s*location: 'BEACHFRONT PREÁ',\n\s*rating: 5,\n\s*exclusiveText: 'BEACHFRONT PREÁ'/g, "badge: 'Vacation Rental',\n      propertyTitle: 'HIGH-END HOUSE 3 SUITES (RENTAL)',\n      location: 'BEACHFRONT PREÁ',\n      rating: 5,\n      exclusiveText: 'VACATION RENTAL BEACHFRONT PREÁ'");

  // ES block
  content = content.replace(/slug: 'villa-condudu-3'[\s\S]*?title: 'ESTANCIA'/g, "slug: 'villa-condudu-3', category: 'temporada',\n      title: 'ALQUILER'");
  content = content.replace(/badge: 'Estancia',\n\s*propertyTitle: 'CASA DE ALTO NIVEL 3 SUITES',\n\s*location: 'FRENTE A LA PLAYA DE PREÁ',\n\s*rating: 5,\n\s*exclusiveText: 'FRENTE A LA PLAYA DE PREÁ'/g, "badge: 'Alquiler Vacacional',\n      propertyTitle: 'CASA DE ALTO NIVEL 3 SUITES (ALQUILER)',\n      location: 'FRENTE A LA PLAYA DE PREÁ',\n      rating: 5,\n      exclusiveText: 'ALQUILER VACACIONAL FRENTE A LA PLAYA DE PREÁ'");
  
  fs.writeFileSync(filePath, content, 'utf8');
}

replaceInFile(dataFile);
replaceInFile(i18nFile);
