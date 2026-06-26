const fs = require('fs');

function processFile(filename) {
  let content = fs.readFileSync(filename, 'utf-8');

  // Add unlisted field to OportunidadeDetalhe
  if (!content.includes('unlisted?: boolean;')) {
    content = content.replace(/category: .*/, "$&\n  unlisted?: boolean;");
  }

  // Find commented out objects and uncomment them, then add unlisted: true
  // The comments are /* { ... } */
  content = content.replace(/\/\*\s*(\{[\s\S]*?\})\s*\*\//g, (match, p1) => {
    // Add unlisted: true to the object
    // Find the last property and insert it before the closing brace
    let obj = p1.replace(/}\s*$/, "  unlisted: true\n}");
    // we need a trailing comma if there wasn't one, but it's an object in an array.
    // wait, the original commented out blocks might not have a comma after the closing brace,
    // or the comma is outside the comment?
    // Let's check the git log: }, */  so the comma might be inside the comment or outside.
    // In git log: }, */ and } */
    return obj;
  });

  fs.writeFileSync(filename, content);
}

processFile('src/data/oportunidadesData.ts');
processFile('src/data/oportunidadesDataI18n.ts');
