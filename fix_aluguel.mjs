import fs from 'fs';

const dataFile = './src/data/oportunidadesData.ts';
const i18nFile = './src/data/oportunidadesDataI18n.ts';

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Regex to find and replace the badge, propertyTitle, and exclusiveText for PT
  content = content.replace(/badge:\s*'Temporada',[\s\S]*?propertyTitle:\s*'.*?3 SU.*?TES',[\s\S]*?location:\s*'.*?PRE.*?',\n\s*rating:\s*5,\n\s*exclusiveText:\s*'.*?PRE.*?'/g, (match) => {
    return match
      .replace(/badge: 'Temporada'/, "badge: 'Aluguel de Temporada'")
      .replace(/propertyTitle: '(.*?)'/, "propertyTitle: '$1 (ALUGUEL)'")
      .replace(/exclusiveText: '(.*?)'/, "exclusiveText: 'ALUGUEL DE TEMPORADA $1'");
  });

  // Regex to find and replace for EN
  content = content.replace(/badge:\s*'Stay',[\s\S]*?propertyTitle:\s*'.*?3 SUITES',[\s\S]*?location:\s*'.*?PRE.*?',\n\s*rating:\s*5,\n\s*exclusiveText:\s*'.*?PRE.*?'/g, (match) => {
    return match
      .replace(/badge: 'Stay'/, "badge: 'Vacation Rental'")
      .replace(/propertyTitle: '(.*?)'/, "propertyTitle: '$1 (RENTAL)'")
      .replace(/exclusiveText: '(.*?)'/, "exclusiveText: 'VACATION RENTAL $1'");
  });

  // Regex to find and replace for ES
  content = content.replace(/badge:\s*'Estancia',[\s\S]*?propertyTitle:\s*'.*?3 SUITES',[\s\S]*?location:\s*'.*?PRE.*?',\n\s*rating:\s*5,\n\s*exclusiveText:\s*'.*?PRE.*?'/g, (match) => {
    return match
      .replace(/badge: 'Estancia'/, "badge: 'Alquiler Vacacional'")
      .replace(/propertyTitle: '(.*?)'/, "propertyTitle: '$1 (ALQUILER)'")
      .replace(/exclusiveText: '(.*?)'/, "exclusiveText: 'ALQUILER VACACIONAL $1'");
  });

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${filePath}`);
}

replaceInFile(dataFile);
replaceInFile(i18nFile);
