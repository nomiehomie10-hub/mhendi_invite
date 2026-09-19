import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "_source-assets");
const OUT = path.join(ROOT, "public/images/mehndi");

const s = (f) => path.join(SRC, f);

/** Scene / frame art that keeps its own background. */
const SCENES = [
  ["ChatGPT Image Sep 19, 2026 at 08_36_10 PM.png", "entry/courtyard-doorway.webp", 1080],
  ["ChatGPT Image Sep 19, 2026 at 08_36_17 PM.png", "hero/courtyard-golden-hour.webp", 1080],
  ["11F54984-BA06-4C71-9AA2-31BF532F7469.PNG", "poster/signature-arch-frame.webp", 1080],
  ["9D66BC4F-9D03-4EE8-BDD4-C24182E64C51.PNG", "celebration/courtyard-dance.webp", 1080],
  ["81138E34-D94F-4B42-868B-3B2DB113A44B.PNG", "venue/courtyard-arch-evening.webp", 1122],
  ["734C90C5-1FB1-460D-B00F-82FD313DB5BA.PNG", "closing/ivory-floral-frame.webp", 1080],
  // ink-on-paper art, composited with mix-blend-mode: multiply on ivory
  ["PHOTO-2026-09-19-21-32-07 2.jpg", "texture/mughal-floral-pattern.webp", 853],
];

/** Art that already carries a real alpha channel. */
const ALPHA_PASSTHROUGH = [
  ["2B3CFC35-B17E-4841-9FA4-A6E278E26E8D.PNG", "botanical/lantern-cluster.webp", 1022],
];

/** Alpha art whose cut-out left a pale glow around the edges. */
const HALOED = [
  ["4D8D226E-79C4-4F74-9E52-78C78CD44717.PNG", "botanical/garland-canopy.webp", 852],
];

/** Art matted onto solid black: recover alpha so it drops onto any background. */
const BLACK_MATTED = [
  ["PHOTO-2026-09-19-21-32-07.jpg", "botanical/corner-spray.webp", 590],
  ["PHOTO-2026-09-19-21-32-07 3.jpg", "ornament/mughal-arch-frame.webp", 590],
];

/**
 * Art exported over a transparency checkerboard, which is baked into the
 * pixels as a 245/254 grey grid. Flattened to white and cropped tight so it
 * can be printed onto the page with a multiply blend.
 */
const CHECKERBOARDED = [
  [
    "ChatGPT Image Sep 19, 2026 at 08_36_14 PM.png",
    "botanical/marigold-wreath.webp",
    900,
  ],
];

/** Printed on an ivory ground that is keyed out so it drops onto any chapter. */
const PRINTED_ON_IVORY = [
  ["58FD1312-B8D4-4F7D-8E20-0B311280B5D3.PNG", "ornament/mughal-border.webp", 1600],
];

/** Icon sheet: 2 columns x 3 rows on ivory paper. */
const ICON_SHEET = "BA9A6B2E-F4EB-4358-B404-5985B9CEF943.PNG";
const ICON_NAMES = [
  ["sharbat", 0, 0],
  ["mehndi-cone", 1, 0],
  ["entrance-arch", 0, 1],
  ["dhol", 1, 1],
  ["dinner", 0, 2],
  ["dupatta", 1, 2],
];

/**
 * Un-matte art painted over pure black. Alpha comes from the brightest
 * channel; colour is divided back out so edges stay clean instead of
 * turning into a dark halo.
 */
async function unmatteBlack(inFile, outFile, width) {
  const img = sharp(inFile).ensureAlpha();
  const { data, info } = await img
    .raw()
    .toBuffer({ resolveWithObject: true });
  const px = info.width * info.height;
  const out = Buffer.alloc(px * 4);
  // Below this the pixel is treated as pure background, above it as solid art.
  const LO = 10;
  const HI = 64;
  for (let i = 0; i < px; i++) {
    const o = i * info.channels;
    const r = data[o];
    const g = data[o + 1];
    const b = data[o + 2];
    const lum = Math.max(r, g, b);
    let a;
    if (lum <= LO) a = 0;
    else if (lum >= HI) a = 255;
    else a = Math.round(((lum - LO) / (HI - LO)) * 255);
    const q = i * 4;
    if (a === 0) {
      out[q] = out[q + 1] = out[q + 2] = out[q + 3] = 0;
    } else {
      // unpremultiply
      const f = 255 / Math.max(a, 1);
      out[q] = Math.min(255, Math.round(r * f));
      out[q + 1] = Math.min(255, Math.round(g * f));
      out[q + 2] = Math.min(255, Math.round(b * f));
      out[q + 3] = a;
    }
  }
  await write(
    sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } }),
    outFile,
    width
  );
}

/**
 * Strip the pale halo a rough cut-out leaves behind.
 *
 * The glow is a wide, feathered band of partial alpha: the artwork itself is
 * essentially all one opacity (~230) while the halo spreads across every
 * value below it. Remapping alpha steeply around that step deletes the band
 * and keeps a one-pixel edge for antialiasing.
 */
async function deHalo(inFile, outFile, width) {
  const { data, info } = await sharp(inFile)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const px = info.width * info.height;
  const out = Buffer.from(data);
  const LO = 196;
  const HI = 228;
  for (let i = 0; i < px; i++) {
    const a = out[i * 4 + 3];
    out[i * 4 + 3] =
      a <= LO ? 0 : a >= HI ? 255 : Math.round(((a - LO) / (HI - LO)) * 255);
  }
  // The garland hangs in the top half; drop the empty pixels below it.
  const trimmed = await sharp(out, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .trim({ threshold: 6 })
    .png()
    .toBuffer();
  await write(sharp(trimmed), outFile, width);
}

/**
 * Replace the exported checkerboard with flat white. Anything bright and
 * colourless is background or a white petal; both read identically once the
 * artwork is multiplied onto ivory paper, so both become pure white.
 */
async function flattenCheckerboard(inFile, outFile, width) {
  const { data, info } = await sharp(inFile)
    .flatten({ background: "#ffffff" })
    .raw()
    .toBuffer({ resolveWithObject: true });
  const px = info.width * info.height;
  const out = Buffer.from(data);
  const ch = info.channels;
  for (let i = 0; i < px; i++) {
    const o = i * ch;
    const r = out[o], g = out[o + 1], b = out[o + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    if (max >= 238 && max - min <= 6) {
      out[o] = out[o + 1] = out[o + 2] = 255;
    }
  }
  // With the ground flat, the wreath can be cropped to its own bounding box
  // instead of shipping the empty portrait canvas around it.
  const cropped = await sharp(out, {
    raw: { width: info.width, height: info.height, channels: ch },
  })
    .png()
    .toBuffer()
    .then((buf) => sharp(buf).trim({ background: "#ffffff", threshold: 4 }).png().toBuffer());

  await write(sharp(await keyPaper(cropped, [255, 255, 255], 6, 22)), outFile, width);
}

/**
 * Lift artwork off its printed ground. The ground is a narrow band of colour;
 * painted pigment sits far outside it, so a distance key in RGB separates the
 * two with a soft edge and no halo.
 *
 * This is used instead of a multiply blend because several of these pieces sit
 * inside transformed or z-indexed wrappers, and a stacking context traps
 * mix-blend-mode so it never reaches the page behind it.
 */
async function keyPaper(buffer, ground = [243, 237, 223], NEAR = 15, FAR = 30) {
  const { data, info } = await sharp(buffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const px = info.width * info.height;
  const out = Buffer.from(data);
  const [PR, PG, PB] = ground;
  for (let i = 0; i < px; i++) {
    const o = i * 4;
    const d = Math.hypot(out[o] - PR, out[o + 1] - PG, out[o + 2] - PB);
    if (d <= NEAR) out[o + 3] = 0;
    else if (d < FAR) out[o + 3] = Math.round(((d - NEAR) / (FAR - NEAR)) * 255);
  }
  return sharp(out, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer();
}

async function write(pipeline, outFile, width) {
  const dest = path.join(OUT, outFile);
  await mkdir(path.dirname(dest), { recursive: true });
  const info = await pipeline
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 82, effort: 6 })
    .toFile(dest);
  console.log(
    `${outFile.padEnd(42)} ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)}kb`
  );
}

async function main() {
  for (const [from, to, w] of SCENES) await write(sharp(s(from)), to, w);
  for (const [from, to, w] of ALPHA_PASSTHROUGH) await write(sharp(s(from)), to, w);
  for (const [from, to, w] of BLACK_MATTED) await unmatteBlack(s(from), to, w);
  for (const [from, to, w] of HALOED) await deHalo(s(from), to, w);
  for (const [from, to, w] of CHECKERBOARDED)
    await flattenCheckerboard(s(from), to, w);
  for (const [from, to, w] of PRINTED_ON_IVORY) {
    const buf = await sharp(s(from)).png().toBuffer();
    await write(sharp(await keyPaper(buf, [244, 236, 219], 13, 28)), to, w);
  }

  const sheet = sharp(s(ICON_SHEET));
  const meta = await sheet.metadata();
  const cw = Math.floor(meta.width / 2);
  const ch = Math.floor(meta.height / 3);
  for (const [name, col, row] of ICON_NAMES) {
    const cell = await sharp(s(ICON_SHEET))
      .extract({ left: col * cw, top: row * ch, width: cw, height: ch })
      .toBuffer();
    // Trim the paper margin away so every icon sits on a tight, even box.
    // A cell that is already tight makes trim throw, so fall back to the cell.
    let art = cell;
    try {
      art = await sharp(cell)
        .trim({ background: "#f4eee3", threshold: 14 })
        .toBuffer();
    } catch {
      console.log(`  (icon-${name}: nothing to trim)`);
    }
    const keyed = await keyPaper(art);
    const padded = await sharp(keyed)
      .extend({
        top: 14,
        bottom: 14,
        left: 14,
        right: 14,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer();
    await write(sharp(padded), `timeline/icon-${name}.webp`, 360);
  }
}

main();
