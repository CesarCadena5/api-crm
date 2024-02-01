
import path from 'path';
import sharp from 'sharp';
import { dirname } from 'path';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const helperImg = async (filePath, fileName, size = 500) => {
    const destinationPath = path.join(__dirname, `../optimizadas/${fileName}`);
    await sharp(filePath)
        .resize({ width: size })
        .rotate()
        .sharpen()
        .normalise()
        .jpeg({ quality: 80 })
        .png({ quality: 80 })
        .webp({ quality: 80 })
        .toFile(destinationPath);
};