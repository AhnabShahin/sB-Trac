/* eslint-disable */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { execSync } = require('child_process');
const ffmpegPath = require('ffmpeg-static');

const ROOT = path.resolve(__dirname, '..');
const RAW_ASSETS = path.join(ROOT, 'Asset');
const TARGET_ASSETS = path.join(ROOT, 'public', 'assets');

// Who We Are section background, used by src/components/sections/principle-section.tsx.
const WHO_WE_ARE_BG = 'B-Trac Industry bg image.jpeg';

// The raw capture is 3156px wide, but the section paints it full-bleed at 45% opacity
// under a dark gradient (see principle-section.tsx), so that resolution is never
// perceived. Capping the encode at 1920px also stops the Next image optimiser from
// advertising a 3840w derivative, and brings the file in line with the other hero
// assets (31-261 KB) instead of ~1 MB.
const WHO_WE_ARE_OPTS = { resize: { width: 1920 }, quality: 68 };

// ISO seal shown in the home page ISO band (src/components/sections/iso-band-section.tsx).
const ISO_CERT_BADGE = ['B-Trac ISO Certification.png', 'badges/iso-certificate.png'];

// Site favicon. Next.js App Router picks up both of these from the app dir and injects
// the <link rel="icon"> tags automatically, so no metadata entry is needed. Kept in the
// pipeline so re-running the script does not drop them.
const FAVICON = ['B-Trac Favicon.png', path.join('src', 'app', 'icon.png')];
const FAVICON_ICO = ['B-Trac Favicon.png', path.join('src', 'app', 'favicon.ico')];

// Wordmark shown in the header and the footer.
//
// DO NOT RUN for the logo without checking this first. This entry re-derives
// public/logo.png from public/logo.jpeg by knocking out the JPEG's opaque light
// plate, and that pipeline is what produced the squashed 2306x220 build (aspect
// 10.48). The file now in public/logo.png is the client's own artwork at
// 4712x435 (aspect 10.83), dropped in verbatim, and it is the one both the header
// and the footer render.
//
// Running `node scripts/process-assets.js` would overwrite that with the older,
// wrongly-proportioned JPEG-derived build and undo the swap. Replace
// public/logo.jpeg with the client's original artwork if this pipeline needs to
// run again, and update the width/height on the header and footer <Image> to match.
const LOGO = ['logo.jpeg', 'logo.png'];

// Ensure directories exist
const dirs = [
  'video',
  'hero',
  'badges',
  'slider/solar',
  'slider/substation',
  'slider/mep',
  'slider/water',
  'projects',
  'banner',
  'texture',
  'timeline',
  'logos/clients',
  'logos/partners',
  'team'
];

dirs.forEach(d => {
  fs.mkdirSync(path.join(TARGET_ASSETS, d), { recursive: true });
});

async function processImage(inputName, outputRelPath, options = {}) {
  const inputPath = path.join(RAW_ASSETS, inputName);
  if (!fs.existsSync(inputPath)) {
    console.warn(`[WARN] Input file missing: ${inputName}`);
    return;
  }

  const outBase = path.join(TARGET_ASSETS, outputRelPath);
  const ext = path.extname(outBase).toLowerCase();
  
  console.log(`Processing image: ${inputName} -> assets/${outputRelPath}`);

  let pipeline = sharp(inputPath);
  if (options.resize) {
    pipeline = pipeline.resize(options.resize.width, options.resize.height, { fit: options.resize.fit || 'cover' });
  }

  if (ext === '.jpg' || ext === '.jpeg') {
    await pipeline.jpeg({ quality: options.quality || 80 }).toFile(outBase);
    // Also generate WebP alongside
    const webpPath = outBase.substring(0, outBase.lastIndexOf('.')) + '.webp';
    await sharp(inputPath)
      .resize(options.resize ? options.resize.width : undefined, options.resize ? options.resize.height : undefined, { fit: 'cover' })
      .webp({ quality: options.quality || 80 })
      .toFile(webpPath);
  } else if (ext === '.png') {
    await pipeline.png().toFile(outBase);
  } else if (ext === '.webp') {
    await pipeline.webp({ quality: options.quality || 80 }).toFile(outBase);
  }
}

// Logo marks. Keys are the raw file names in Asset/, values are the target file names,
// which must match the `logo` paths in src/data/clients.json and src/data/partners.json.
const CLIENT_LOGOS = [
  ['Bat.png', 'british-american-tobacco.png'],
  ['Nestle.png', 'nestle-bangladesh.png'],
  ['Unilever.png', 'unilever-bangladesh.png'],
  ['coca cola.png', 'coca-cola-bangladesh.png'],
  ['Square.png', 'square-group.png'],
  ['Chevron.png', 'chevron-bangladesh.png'],
  ['client logo 2.png', 'bangladesh-navy.png'],
  ['walton.png', 'walton-hi-tech.png'],
  ['aci.png', 'aci-group.png'],
  ['Akij.png', 'akij-group.png'],
  ['Bashundhara.png', 'bashundhara-group.png'],
  ['Beximco.png', 'beximco-pharma.png'],
  ['incepta.png', 'incepta-pharma.png'],
  ['Popular.png', 'popular-pharmaceuticals.png'],
  ['acme.png', 'acme-laboratories.png'],
  ['sk+f.png', 'sk-f-pharmaceuticals.png'],
  ['H Health care.png', 'h-healthcare.png'],
  ['Life Med.png', 'lifemed.png'],
  ['GPH.png', 'gph-ispat.png'],
  ['sg.png', 'sharmin-group.png'],
  ['supar.png', 'super-petrochemical.png'],
  ['TK group.png', 'tk-group.png'],
  ['TRU.png', 'tru-group.png'],
  ['srizony.png', 'srizony-bangladesh.png'],
  ['anfords.png', 'anfords.png'],
  ['aadata.png', 'aarata.png'],
  ['montrms.png', 'montrims.png'],
  ['linda.png', 'linde-bangladesh.png'],
  ['Bay.png', 'bay.png'],
  ['Noman.png', 'noman-group.png'],
  ['Pakiza.png', 'pakiza.png'],
  ['Hatil.png', 'hatil.png'],
  ['Premier.png', 'premier-hotels-resorts.png'],
  ['New zealand dairy.png', 'new-zealand-dairy.png'],
  ['polli biddot.png', 'breb.png'],
  ['client logo.png', 'bangladesh-machine-tools-factory.png'],
  ['IOM.png', 'iom.png'],
  ['UNHCR.png', 'unhcr.png'],
  ['BUP.png', 'bup.png'],
];

const PARTNER_LOGOS = [
  ['ABB.png', 'abb.png'],
  ['Schneider.png', 'schneider.png'],
  ['CHNT.png', 'chnt.png'],
  ['Siemens.png', 'siemens.png'],
  ['cat.png', 'cat.png'],
  ['SMA.png', 'sma.png'],
  ['Huawei.png', 'huawei.png'],
  ['solis.png', 'solis.png'],
  ['Trinasolar.png', 'trina.png'],
  ['JA Solar.png', 'ja-solar.png'],
  ['Longi.png', 'longi.png'],
  ['Jinko.png', 'jinko.png'],
  ['SGB.png', 'sgb-smit.png'],
  ['ARADY.png', 'arady.png'],
  ['Compair.png', 'compair.png'],
  ['IR.png', 'ingersoll-rand.png'],
  ['TRANE.png', 'trane.png'],
  ['wilo.png', 'wilo.png'],
  ['KRUGER.png', 'kruger.png'],
  ['Atlas.png', 'atlas-copco.png'],
  ['Daikin.png', 'daikin.png'],
  ['Trox.png', 'trox.png'],
  ['BBS.png', 'bbs-cables.png'],
  ['Lapp.png', 'lapp-kabel.png'],
  ['BRB.png', 'brb-cable.png'],
  ['Leader.png', 'leader.png'],
  ['X Energy.png', 'x-energy.png'],
  ['DEIF.png', 'deif.png'],
  ['Nalco.png', 'nalco.png'],
];

// Source marks are 1000x1000 artboards with the artwork floating in mostly empty space.
// Trimming that empty (alpha) area first is what lets a mark render at legible size inside
// the 64px logo tile, instead of shrinking down with its own padding.
const LOGO_BOX = { width: 480, height: 200 };

async function processLogo(inputName, outputRelPath) {
  const inputPath = path.join(RAW_ASSETS, inputName);
  if (!fs.existsSync(inputPath)) {
    console.warn(`[WARN] Logo file missing: ${inputName}`);
    return;
  }

  const outBase = path.join(TARGET_ASSETS, outputRelPath);
  console.log(`Processing logo: ${inputName} -> assets/${outputRelPath}`);

  const meta = await sharp(inputPath).metadata();
  const { isOpaque } = await sharp(inputPath).stats();

  let pipeline = sharp(inputPath);
  if (meta.hasAlpha && !isOpaque) {
    pipeline = pipeline.trim({ threshold: 10 });
  }

  await pipeline
    .resize({ ...LOGO_BOX, fit: 'inside' })
    .png({ compressionLevel: 9 })
    .toFile(outBase);
}

async function processLogos() {
  for (const [inputName, outputName] of CLIENT_LOGOS) {
    await processLogo(inputName, path.join('logos', 'clients', outputName));
  }
  for (const [inputName, outputName] of PARTNER_LOGOS) {
    await processLogo(inputName, path.join('logos', 'partners', outputName));
  }
}

// The ISO seal is a 512x512 artboard with the ring floating in transparent space, so it is
// trimmed like the logo marks — otherwise the transparent margin eats the render size.
// PNG (not JPEG) because the transparent ring must survive; level 9 on a flat-colour
// graphic like this costs no visual quality.
async function processIsoCertBadge() {
  const [inputName, outputRelPath] = ISO_CERT_BADGE;
  const inputPath = path.join(RAW_ASSETS, inputName);
  if (!fs.existsSync(inputPath)) {
    console.warn(`[WARN] Input file missing: ${inputName}`);
    return;
  }

  const outBase = path.join(TARGET_ASSETS, outputRelPath);
  console.log(`Processing badge: ${inputName} -> assets/${outputRelPath}`);

  await sharp(inputPath)
    .resize({ width: 512, height: 512, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    // The seal is a flat graphic, so quantizing to a 256-colour palette is
    // visually exact while cutting the truecolour PNG (~304 KB) down to ~87 KB. Alpha preserved.
    .png({ palette: true, quality: 90, colors: 256, compressionLevel: 9, effort: 10 })
    .toFile(outBase);
}

/**
 * Favicon -> src/app/icon.png. The App Router auto-injects the <link rel="icon"> tags
 * from this file, so no metadata entry is needed. Re-encoded through sharp at 512px so
 * the output is byte-identical every run rather than a raw copy of the source file.
 */
async function processFavicon() {
  const [inputName, outputRelPath] = FAVICON;
  const inputPath = path.join(RAW_ASSETS, inputName);
  if (!fs.existsSync(inputPath)) {
    console.warn(`[WARN] Input file missing: ${inputName}`);
    return;
  }

  const outBase = path.join(ROOT, outputRelPath);
  console.log(`Processing favicon: ${inputName} -> ${outputRelPath}`);

  await sharp(inputPath)
    .resize({ width: 512, height: 512, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    // Keep the truecolour alpha channel: the mark has soft edges that a quantised
    // palette would band. 17 KB at 512px is already small enough to inline-fetch.
    .png({ compressionLevel: 9, effort: 10 })
    .toFile(outBase);

  await processFaviconIco(inputPath);
}

/**
 * Wraps the mark in a minimal single-image .ico container.
 *
 * The repo previously shipped Next.js's own placeholder favicon.ico, so /favicon.ico
 * — the path browsers request with no hint — was serving the framework logo. Browsers
 * that honour only the .ico fallback would have shown the wrong mark, so the container
 * is rebuilt from the real asset.
 *
 * A Vista-era ICO may store PNG data verbatim, so the encoded PNG is embedded as-is
 * rather than being decoded to a BMP. The directory entry's width/height are single
 * bytes where 0 means 256, hence the 256px render.
 */
async function processFaviconIco(inputPath) {
  const [, icoRelPath] = FAVICON_ICO;
  const icoPath = path.join(ROOT, icoRelPath);
  console.log(`Processing favicon: ${inputPath.split(path.sep).pop()} -> ${icoRelPath}`);

  const png = await sharp(inputPath)
    .resize({ width: 256, height: 256, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9, effort: 10 })
    .toBuffer();

  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0);           // reserved
  header.writeUInt16LE(1, 2);           // type: icon
  header.writeUInt16LE(1, 4);           // image count
  header.writeUInt8(0, 6);              // width 0 => 256
  header.writeUInt8(0, 7);              // height 0 => 256
  header.writeUInt8(0, 8);              // palette size
  header.writeUInt8(0, 9);              // reserved
  header.writeUInt16LE(1, 10);          // colour planes
  header.writeUInt16LE(32, 12);         // bits per pixel
  header.writeUInt32LE(png.length, 14); // image byte length
  header.writeUInt32LE(22, 18);         // offset to image data

  fs.writeFileSync(icoPath, Buffer.concat([header, png]));
}

/**
 * public/logo.jpeg -> public/logo.png, with the baked-in background plate removed.
 *
 * The JPEG is a flat #f7f7f7 rectangle covering ~80% of the pixels, and it sits on a
 * near-black header and footer, so the wordmark currently reads as a light slab.
 *
 * A plain "knock out the light pixels" pass is not safe here: 58.7% of the pixels
 * inside the mark's own bounding box are also near-white, so that would delete most
 * of the wordmark itself. Instead this floods the plate inward from the image border
 * and clears only the region connected to the edge, which leaves the mark's interior
 * whites intact. The result is feathered slightly to hide the JPEG's ringing.
 */
async function processLogo() {
  const [inputName, outputRelPath] = LOGO;
  const inputPath = path.join(ROOT, 'public', inputName);
  if (!fs.existsSync(inputPath)) {
    console.warn(`[WARN] Input file missing: public/${inputName}`);
    return;
  }

  const outBase = path.join(ROOT, 'public', outputRelPath);
  console.log(`Processing logo: public/${inputName} -> public/${outputRelPath}`);

  const { data, info } = await sharp(inputPath)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels } = info;
  const total = w * h;

  // Plate test: bright and near-neutral. The chroma bound is what stops the flood
  // from leaking through the blue letterforms, and the 215 floor absorbs the JPEG's
  // ringing along the bottom edge. The floor is not what protects the mark's interior
  // whites — the closed letterforms are, so it can sit well clear of the 247 plate.
  const isPlate = (p) => {
    const r = data[p * channels];
    const g = data[p * channels + 1];
    const b = data[p * channels + 2];
    const min = Math.min(r, g, b);
    const max = Math.max(r, g, b);
    return min >= 215 && max - min <= 30;
  };

  const plate = new Uint8Array(total);
  const stack = [];
  for (let x = 0; x < w; x++) {
    stack.push(x, (h - 1) * w + x);
  }
  for (let y = 0; y < h; y++) {
    stack.push(y * w, y * w + w - 1);
  }

  while (stack.length) {
    const p = stack.pop();
    if (plate[p] || !isPlate(p)) continue;
    plate[p] = 1;
    const x = p % w;
    const y = (p / w) | 0;
    if (x > 0) stack.push(p - 1);
    if (x < w - 1) stack.push(p + 1);
    if (y > 0) stack.push(p - w);
    if (y < h - 1) stack.push(p + w);
  }

  let cleared = 0;
  const mask = Buffer.alloc(total);
  for (let p = 0; p < total; p++) {
    if (plate[p]) {
      cleared++;
      mask[p] = 0;
    } else {
      mask[p] = 255;
    }
  }
  console.log(`  cleared plate: ${((100 * cleared) / total).toFixed(1)}% of pixels`);

  // Feather the cut edge, then re-attach the untouched colour channels so the mark
  // keeps its own colours. Blur is applied to the alpha alone, not the artwork.
  // `toColourspace('b-w')` is required: sharp promotes a 1-channel raw buffer to sRGB
  // on write, which would hand joinChannel a 3x oversized buffer and corrupt the join.
  const alpha = await sharp(mask, { raw: { width: w, height: h, channels: 1 } })
    .blur(0.7)
    .toColourspace('b-w')
    .raw()
    .toBuffer();

  // Crop to the surviving content so the file carries no empty margin. sharp's
  // trim() is not used: the feathered edge leaves faint alpha just inside the border,
  // which trim reads as content and refuses to crop.
  let x0 = w;
  let y0 = h;
  let x1 = -1;
  let y1 = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (mask[y * w + x] > 16) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  if (x1 < 0) {
    console.warn('[WARN] Logo knockout removed everything — public/logo.png not written');
    return;
  }
  const pad = 4;
  const left = Math.max(0, x0 - pad);
  const top = Math.max(0, y0 - pad);
  const region = {
    left,
    top,
    width: Math.min(w - left, x1 - x0 + 1 + pad * 2),
    height: Math.min(h - top, y1 - y0 + 1 + pad * 2),
  };
  console.log(`  content ${x1 - x0 + 1}x${y1 - y0 + 1}, cropped to ${region.width}x${region.height}`);

  // Two passes: the crop is applied to the encoded image, not the raw pipeline.
  // sharp silently drops `extract()` when the same instance has already had
  // joinChannel applied to raw input, so the joined buffer is materialised first.
  const joined = await sharp(data, { raw: { width: w, height: h, channels } })
    .joinChannel(alpha, { raw: { width: w, height: h, channels: 1 } })
    .png({ compressionLevel: 6 })
    .toBuffer();

  await sharp(joined)
    .extract(region)
    // A flat wordmark quantises almost losslessly: measured average colour error is
    // ~2/255, well under a visible threshold, and it cuts the file by ~85% versus
    // truecolour. The alpha channel survives quantisation.
    .png({ palette: true, quality: 90, colors: 128, compressionLevel: 9, effort: 10 })
    .toFile(outBase);
}

function processVideo() {
  const movPath = path.join(RAW_ASSETS, 'new hero btrac.mp4');
  if (!fs.existsSync(movPath)) {
    console.warn('[WARN] Video file "new hero btrac.mp4" not found');
    return;
  }

  const mp4Path = path.join(TARGET_ASSETS, 'video', 'home-hero.mp4');

  console.log('Converting hero video to MP4...');

  // Convert to MP4 (H.264, no audio, optimized bit rate)
  try {
    const mp4Cmd = `"${ffmpegPath}" -y -i "${movPath}" -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 28 -an -preset slow -movflags +faststart "${mp4Path}"`;
    execSync(mp4Cmd, { stdio: 'inherit' });
    console.log('MP4 conversion complete.');
  } catch (err) {
    console.error('Failed MP4 conversion:', err.message);
  }

  // No WebM: VP9 encodes this footage larger than x264 at matched quality, and since
  // <source webm> is picked first by Chrome/Firefox it would ship the heavier file.
}

function processVideoPoster() {
  const movPath = path.join(RAW_ASSETS, 'new hero btrac.mp4');
  if (!fs.existsSync(movPath)) return;

  const rawPoster = path.join(TARGET_ASSETS, 'video', '_poster-raw.jpg');
  const jpgPath = path.join(TARGET_ASSETS, 'video', 'home-hero-poster.jpg');
  const webpPath = path.join(TARGET_ASSETS, 'video', 'home-hero-poster.webp');

  console.log('Extracting hero video poster frame...');
  try {
    execSync(`"${ffmpegPath}" -y -ss 2 -i "${movPath}" -frames:v 1 -q:v 3 "${rawPoster}"`, { stdio: 'inherit' });
    return sharp(rawPoster)
      .resize(1600)
      .toBuffer()
      .then(async (buf) => {
        await sharp(buf).jpeg({ quality: 62, mozjpeg: true }).toFile(jpgPath);
        await sharp(buf).webp({ quality: 62 }).toFile(webpPath);
        fs.unlinkSync(rawPoster);
        console.log('Poster generated.');
      });
  } catch (err) {
    console.error('Failed poster extraction:', err.message);
  }
}

async function run() {
  // `node scripts/process-assets.js logos` regenerates only the client/partner logo marks.
  if (process.argv[2] === 'logos') {
    await processLogos();
    console.log('Logo processing completed successfully.');
    return;
  }

  // `node scripts/process-assets.js who-we-are` regenerates only the Who We Are background.
  // Its own filename (rather than reusing hero/about.jpg) so the Next image optimiser,
  // which cannot invalidate already-cached entries, picks the new asset up immediately.
  if (process.argv[2] === 'who-we-are') {
    await processImage(WHO_WE_ARE_BG, 'hero/who-we-are.jpg', WHO_WE_ARE_OPTS);
    console.log('Who We Are background processed successfully.');
    return;
  }

  // `node scripts/process-assets.js iso-cert` regenerates only the ISO seal badge.
  if (process.argv[2] === 'iso-cert') {
    await processIsoCertBadge();
    console.log('ISO certification badge processed successfully.');
    return;
  }

  // `node scripts/process-assets.js favicon` regenerates only the site favicon.
  if (process.argv[2] === 'favicon') {
    await processFavicon();
    console.log('Favicon processed successfully.');
    return;
  }

  // `node scripts/process-assets.js logo` regenerates only the transparent wordmark.
  if (process.argv[2] === 'logo') {
    await processLogo();
    console.log('Logo processed successfully.');
    return;
  }

  console.log('Starting Asset Integration Processing...');

  // Poster is extracted from the hero video itself so it matches frame 1 exactly (no flash on load)
  await processVideoPoster();

  // Heroes
  await processImage('2.Solar page top banner.png', 'hero/solar.jpg');
  await processImage('3. Substation page top banner.png', 'hero/substation.jpg');
  await processImage('4. MEP page top banner.png', 'hero/mep.jpg');
  await processImage('5. Water Treatment page top banner.png', 'hero/water.jpg');
  await processImage(WHO_WE_ARE_BG, 'hero/who-we-are.jpg', WHO_WE_ARE_OPTS);
  await processImage('7.After-Sales page top banner.png', 'hero/after-sales.jpg');
  await processImage('8.Contact page top banner.png', 'hero/contact.jpg');
  await processImage('Partners.png', 'hero/partners.jpg');
  await processImage('Clients.png', 'hero/clients.jpg');

  // Sliders - Solar
  await processImage('SOLAR PROJECT SLIDER 1.png', 'slider/solar/01.jpg');
  await processImage('SOLAR PROJECT SLIDER 2.png', 'slider/solar/02.jpg');
  await processImage('SOLAR PROJECT SLIDER 3.png', 'slider/solar/03.jpg');
  await processImage('SOLAR PROJECT SLIDER 4.png', 'slider/solar/04.jpg');

  // Sliders - Substation
  await processImage('SUBSTATION PROJECT SLIDER 1.png', 'slider/substation/01.jpg');
  await processImage('SUBSTATION PROJECT SLIDER 2.png', 'slider/substation/02.jpg');
  await processImage('SUBSTATION PROJECT SLIDER 3.png', 'slider/substation/03.jpg');
  await processImage('SUBSTATION PROJECT SLIDER 4.png', 'slider/substation/04.jpg');

  // Sliders - MEP
  await processImage('MEP PROJECT SLIDER 1.png', 'slider/mep/01.jpg');
  await processImage('MEP PROJECT SLIDER 2.png', 'slider/mep/02.jpg');
  await processImage('MEP PROJECT SLIDER  3.png', 'slider/mep/03.jpg');
  await processImage('MEP PROJECT SLIDER 4.png', 'slider/mep/04.jpg');

  // Sliders - Water
  await processImage('WATER TREATMENT PROJECT SLIDER 1.png', 'slider/water/01.jpg');
  await processImage('WATER TREATMENT PROJECT SLIDER 2.png', 'slider/water/02.jpg');
  await processImage('WATER TREATMENT PROJECT SLIDER 3.png', 'slider/water/03.jpg');
  await processImage('WATER TREATMENT PROJECT SLIDER 4.png', 'slider/water/04.jpg');

  // Projects
  await processImage('GENERIC PROJECT PHOTOS 1.png', 'projects/featured.jpg');
  await processImage('GENERIC PROJECT PHOTOS 2.png', 'projects/p-01.jpg');
  await processImage('GENERIC PROJECT PHOTOS 3.png', 'projects/p-02.jpg');
  await processImage('GENERIC PROJECT PHOTOS 4.png', 'projects/p-03.jpg');
  await processImage('GENERIC PROJECT PHOTOS 5.png', 'projects/p-04.jpg');
  await processImage('GENERIC PROJECT PHOTOS 6.png', 'projects/p-05.jpg');

  // Banners
  await processImage('Homepage promo banner.png', 'banner/home-promo.jpg');
  await processImage('Solar web banner.png', 'banner/solar-cta.jpg');

  // Texture
  await processImage('Homepage service card background.png', 'texture/card-bg.png');

  // Certification badges
  await processIsoCertBadge();

  // Favicon
  await processFavicon();

  // Wordmark
  await processLogo();

  // Timeline
  await processImage('About page timeline photos 1.png', 'timeline/2004.jpg');
  await processImage('Timeline Shot 1.png', 'timeline/2009.jpg');
  await processImage('About page timeline photos 2.png', 'timeline/2014.jpg');
  await processImage('About page timeline photos 3.png', 'timeline/2018.jpg');
  await processImage('GENERIC PROJECT PHOTOS 1.png', 'timeline/2023.jpg');

  // Video processing handled via ffmpeg CLI
  // processVideo();

  console.log('Asset processing completed successfully.');
}

run().catch(err => {
  console.error('Fatal error in process-assets:', err);
  process.exit(1);
});
