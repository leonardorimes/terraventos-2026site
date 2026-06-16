import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputDir = './public/terra_ventos_house';
const outputDir = './public/terra_ventos_house/compressed';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs.readdirSync(inputDir).filter(file => file.match(/\.(jpg|jpeg|png)$/i));

async function processImages() {
  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file.replace(/\.[^/.]+$/, ".webp"));
    
    console.log(`Compressing ${file}...`);
    try {
      await sharp(inputPath)
        .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(outputPath);
      console.log(`Saved ${outputPath}`);
    } catch (err) {
      console.error(`Error processing ${file}:`, err);
    }
  }
}

processImages();
