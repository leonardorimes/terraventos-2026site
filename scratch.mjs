import fs from 'fs';
const content = fs.readFileSync('src/data/oportunidadesData.ts', 'utf-8');
// Very hacky parse: since it's an export const, we can just use regex to find id, title, price
const regex = /id:\s*"([^"]+)"[\s\S]*?propertyTitle:\s*"([^"]+)"[\s\S]*?priceTag:\s*"([^"]+)"[\s\S]*?price:\s*"([^"]+)"/g;
let match;
while ((match = regex.exec(content)) !== null) {
  console.log(`${match[1]} - ${match[2]} - ${match[3]} ${match[4]}`);
}
