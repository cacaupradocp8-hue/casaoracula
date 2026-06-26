import sharp from 'sharp';
import { readdirSync, statSync, renameSync } from 'fs';
import { join, extname } from 'path';

const DIR = 'src/assets';
const MIN = 300 * 1024; // 300KB
const MAX_W = 1600;

async function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) { await walk(p); continue; }
    const ext = extname(name).toLowerCase();
    if (!['.png', '.jpg', '.jpeg'].includes(ext)) continue;
    if (s.size < MIN) continue;
    try {
      const img = sharp(p);
      const meta = await img.metadata();
      const hasAlpha = meta.hasAlpha;
      const width = meta.width && meta.width > MAX_W ? MAX_W : meta.width;
      const tmp = p + '.tmp';
      let pipeline = sharp(p).rotate();
      if (meta.width && meta.width > MAX_W) pipeline = pipeline.resize({ width: MAX_W });
      if (ext === '.png') {
        // keep png for alpha, otherwise convert to jpg
        if (hasAlpha) {
          await pipeline.png({ quality: 75, compressionLevel: 9, palette: true }).toFile(tmp);
        } else {
          await pipeline.jpeg({ quality: 78, mozjpeg: true, progressive: true }).toFile(tmp);
        }
      } else {
        await pipeline.jpeg({ quality: 78, mozjpeg: true, progressive: true }).toFile(tmp);
      }
      const newSize = statSync(tmp).size;
      if (newSize < s.size * 0.9) {
        renameSync(tmp, p);
        console.log(`${p}: ${(s.size/1024).toFixed(0)}KB → ${(newSize/1024).toFixed(0)}KB`);
      } else {
        const { unlinkSync } = await import('fs');
        unlinkSync(tmp);
      }
    } catch (e) {
      console.error(`fail ${p}: ${e.message}`);
    }
  }
}
await walk(DIR);
await walk('public');
