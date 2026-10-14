/* eslint-disable */
/**
 * Pulls the catalogue photography out of `Asset/product with sample pics.pdf` into
 * `public/assets/products/`, named to match the slugs used by src/data/products.ts.
 *
 * The PDF is a flat list of numbered captions, each followed by its photo(s), so the
 * image XObjects are read by object number (page order) and mapped by hand in
 * PHOTOS below. That mapping was established by decoding the page content streams
 * for caption/photo positions.
 *
 * Streams are sliced using each object's own /Length rather than by scanning for JPEG
 * markers: three of the photos are FlateDecode raw RGB (not JPEG at all) and two more
 * carry an /SMask alpha channel, both of which a marker scan silently corrupts.
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const PDF = path.join(ROOT, 'Asset', 'product with sample pics.pdf');
const OUT = path.join(ROOT, 'public', 'assets', 'products');

/** Object number in the PDF -> output basename (no extension). */
const PHOTOS = {
  15: 'substation-33kv-11kv',
  17: 'substation-11kv',
  18: 'oil-type-transformer',
  19: 'hv-switchgear-1',
  20: 'hv-switchgear-2',
  23: 'lv-switchgear',
  24: 'synchronization-panels',
  25: 'motor-control-centres',
  26: 'ngr-ngs-panels',
  29: 'scada-automation',
  30: 'automatic-transfer-switch',
  32: 'industrial-ups',
  35: 'harmonic-filters',
  36: 'power-distribution-systems',
  37: 'retrofitting-works',
  38: 'lightning-protection-lps',
  41: 'deif-agi',
  42: 'deif-gpc3',
  43: 'deif-agc',
  44: 'deif-battery-chargers',
  45: 'deif-iom',
  48: 'programmable-logic-controlling',
  49: 'mep-solutions',
  50: 'generator-installation',
  51: 'boiler-epc',
  54: 'machinery-installation',
  55: 'hvac-system',
  56: 'industrial-piping',
  57: 'fuel-storage',
  60: 'fire-hazard',
  61: 'cctv-access-control',
  62: 'sound-attenuation-1',
  63: 'sound-attenuation-2',
  64: 'heavy-lifting',
  67: 'building-management-system',
  68: 'mufflers',
  70: 'ais-gis-panels',
  71: 'automatic-voltage-regulators',
  74: 'on-grid-solar',
  75: 'hybrid-solar',
  76: 'energy-storage',
};

const raw = fs.readFileSync(PDF);
const latin = raw.toString('latin1');

/** Indirect objects keyed by number, each with its dictionary and exact stream bytes. */
function readObjects() {
  const objects = new Map();
  const starts = [];
  const re = /(\d+) 0 obj\b/g;
  let m;
  while ((m = re.exec(latin))) starts.push({ num: Number(m[1]), at: m.index });

  for (const { num, at } of starts) {
    const streamAt = latin.indexOf('stream', at);
    if (streamAt === -1) continue;
    const dict = latin.slice(at, streamAt);

    let dataStart = streamAt + 'stream'.length;
    if (raw[dataStart] === 0x0d) dataStart += 1;
    if (raw[dataStart] === 0x0a) dataStart += 1;

    const declared = /\/Length\s+(\d+)/.exec(dict);
    if (!declared) continue;
    objects.set(num, { dict, data: raw.subarray(dataStart, dataStart + Number(declared[1])) });
  }
  return objects;
}

/** Reads one image XObject's header fields. */
function readHeader(dict) {
  return {
    filter: /\/Filter\s*\/(\w+)/.exec(dict)[1],
    width: Number(/\/Width\s+(\d+)/.exec(dict)[1]),
    height: Number(/\/Height\s+(\d+)/.exec(dict)[1]),
    channels: /\/ColorSpace\s*\/DeviceGray/.test(dict) ? 1 : 3,
  };
}

/**
 * Decodes an image XObject into a sharp pipeline. Three of the photos are FlateDecode
 * raw samples rather than JPEG, and two carry an /SMask alpha channel, so both paths
 * have to be handled or the pixels come out unusable.
 */
function decodeImage(objects, num) {
  const obj = objects.get(num);
  if (!obj) throw new Error(`object ${num} not found`);

  const { filter, width, height, channels } = readHeader(obj.dict);
  const raw = { width, height, channels };

  let pipeline;
  if (filter === "DCTDecode") {
    // The stream is already a complete JPEG — hand the bytes straight to sharp.
    pipeline = sharp(obj.data);
  } else if (filter === "FlateDecode") {
    pipeline = sharp(zlib.inflateSync(obj.data), { raw });
  } else {
    throw new Error(`object ${num}: unsupported filter ${filter}`);
  }

  const smask = /\/SMask\s+(\d+)\s+0\s+R/.exec(obj.dict);
  if (!smask) return pipeline;

  const mask = objects.get(Number(smask[1]));
  if (!mask) throw new Error(`object ${num}: SMask ${smask[1]} not found`);
  return pipeline.ensureAlpha().joinChannel(zlib.inflateSync(mask.data), {
    raw: { width, height, channels: 1 },
  });
}

async function main() {
  const objects = readObjects();
  fs.mkdirSync(OUT, { recursive: true });

  for (const [num, slug] of Object.entries(PHOTOS)) {
    const base = path.join(OUT, slug);
    // A sharp pipeline is single-use once it has run, so decode afresh per format.
    await decodeImage(objects, Number(num)).jpeg({ quality: 80, mozjpeg: true }).toFile(`${base}.jpg`);
    await decodeImage(objects, Number(num)).webp({ quality: 80 }).toFile(`${base}.webp`);
    const meta = await sharp(fs.readFileSync(`${base}.jpg`)).metadata();
    console.log(`${slug}: obj ${num} -> ${meta.width}x${meta.height}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
