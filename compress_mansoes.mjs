import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const dir = path.join(process.cwd(), 'public/mansoes');

async function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      await processDirectory(fullPath);
    } else if (entry.isFile() && /\.(png|jpe?g)$/i.test(entry.name)) {
      const tempPath = fullPath + '.tmp';
      
      try {
        const image = sharp(fullPath);
        const metadata = await image.metadata();
        
        if (metadata.format === 'webp') {
           console.log(`Skipping already webp: ${fullPath}`);
           continue;
        }

        let operation = image;
        
        if (metadata.width > 1920) {
          operation = operation.resize(1920, null, { withoutEnlargement: true });
        }
        
        await operation.webp({ quality: 75 }).toFile(tempPath);
        
        fs.renameSync(tempPath, fullPath);
        console.log(`Compressed: ${fullPath}`);
      } catch (e) {
        console.error(`Failed to process ${fullPath}:`, e);
      }
    }
  }
}

processDirectory(dir).then(() => console.log('Done compressing mansoes!'));
