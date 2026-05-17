import zlib from 'zlib';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');

function crc32(buf) {
    const table = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
        let c = i;
        for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
        table[i] = c;
    }
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < buf.length; i++) {
        crc = table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
    }
    return (crc ^ 0xFFFFFFFF) >>> 0;
}

function pngChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const t = Buffer.from(type, 'ascii');
    const crcVal = Buffer.alloc(4);
    crcVal.writeUInt32BE(crc32(Buffer.concat([t, data])));
    return Buffer.concat([len, t, data, crcVal]);
}

function createGradientPNG(width, height) {
    const rows = [];
    for (let y = 0; y < height; y++) {
        const row = Buffer.alloc(1 + width * 3);
        row[0] = 0; // filter: None
        for (let x = 0; x < width; x++) {
            const xRatio = x / width;
            const yRatio = y / height;
            // Gradient: deep blue (30,58,138) top-left → indigo (79,70,229) bottom-right
            row[1 + x * 3]     = Math.round(30  + xRatio * (79  - 30)  + yRatio * 10);
            row[1 + x * 3 + 1] = Math.round(58  + xRatio * (70  - 58)  - yRatio * 10);
            row[1 + x * 3 + 2] = Math.round(138 + xRatio * (229 - 138) + yRatio * 20);
        }
        rows.push(row);
    }
    const raw = Buffer.concat(rows);
    const compressed = zlib.deflateSync(raw, { level: 9 });

    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(width, 0);
    ihdr.writeUInt32BE(height, 4);
    ihdr[8] = 8; ihdr[9] = 2; // 8-bit RGB

    return Buffer.concat([
        Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), // PNG signature
        pngChunk('IHDR', ihdr),
        pngChunk('IDAT', compressed),
        pngChunk('IEND', Buffer.alloc(0)),
    ]);
}

// og-image.png  1200×630
fs.writeFileSync(path.join(publicDir, 'og-image.png'), createGradientPNG(1200, 630));
console.log('✅ public/og-image.png');

// apple-touch-icon.png  180×180
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createGradientPNG(180, 180));
console.log('✅ public/apple-touch-icon.png');

// favicon-192.png  192×192  (for PWA manifest)
fs.writeFileSync(path.join(publicDir, 'icon-192.png'), createGradientPNG(192, 192));
console.log('✅ public/icon-192.png');

// favicon-512.png  512×512  (for PWA manifest)
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), createGradientPNG(512, 512));
console.log('✅ public/icon-512.png');
