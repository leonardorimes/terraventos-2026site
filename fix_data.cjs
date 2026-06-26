const fs = require('fs');

function processFile(filename, isI18n) {
  let content = fs.readFileSync(filename, 'utf-8');

  // Add unlisted field to OportunidadeDetalhe if not i18n
  if (!isI18n && !content.includes('unlisted?: boolean;')) {
    content = content.replace(/category: 'venda' \| 'lancamento' \| 'temporada' \| 'investimento';/, "$&\n  unlisted?: boolean;");
  }

  // Find all instances of commented objects with specific IDs
  // We use a simpler approach: replace /* { and } */ around the target IDs
  const targetIds = ['15', '07', '02', '11', '12'];
  
  for (const id of targetIds) {
    // Regex explanation:
    // Match /* (optional spaces/newlines) { (optional spaces/newlines) id: "ID" ... } (optional spaces/newlines/comma) */
    // We'll just look for /* { ... id: '15' ... } */ 
    const regex = new RegExp(`\\/\\*\\s*(\\{[\\s\\S]*?id:\\s*(["'])` + id + `\\2[\\s\\S]*?\\})\\s*,?\\s*\\*\\/`, 'g');
    content = content.replace(regex, (match, objStr) => {
      // Remove any trailing commas inside the obj string just in case
      let cleanedObj = objStr.replace(/,?\s*}$/, "");
      return cleanedObj + ",\n    unlisted: true\n  },";
    });
  }

  // For id 15 which might have been commented like:
  /* { ... }, */
  // The regex above handles the trailing comma inside the comment. 

  fs.writeFileSync(filename, content);
}

processFile('src/data/oportunidadesData.ts', false);
processFile('src/data/oportunidadesDataI18n.ts', true);
