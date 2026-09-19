/**
 * The geometry of a woman's hand with bridal mehndi on it.
 *
 * Everything here is pure arithmetic from fixed constants: the server and the
 * client generate identical markup, and nothing depends on measurement.
 *
 * The hand is palm-up, and it is ONE continuous outline rather than a palm
 * with fingers laid over it. Overlapping shapes could never give the two
 * things that make a hand read as a hand: webbing that rises into a soft V
 * between the fingers, and a thumb that swells out of the palm instead of
 * being pinned to its edge. Both are curves in the outline below.
 */

export type Stroke = { d: string; transform?: string };

const R = (n: number) => Math.round(n * 100) / 100;

/** A digit: widest at the knuckle, narrowing to a rounded tip. */
export type Digit = {
  cx: number;
  tipY: number;
  baseY: number;
  wTip: number;
  wBase: number;
  /** Degrees of splay, taken about the knuckle. */
  splay: number;
};

export function digitTransform(d: Digit) {
  return d.splay ? `rotate(${d.splay} ${R(d.cx)} ${R(d.baseY)})` : undefined;
}

/**
 * Slender fingers of unequal length and width — middle longest, pinky
 * markedly shorter and finer — each splayed a little further than the last.
 */
export const FINGERS: Digit[] = [
  { cx: 163, tipY: 216, baseY: 300, wTip: 26, wBase: 28, splay: 0 },
  { cx: 202.5, tipY: 190, baseY: 296, wTip: 27, wBase: 29, splay: 0 },
  { cx: 242, tipY: 218, baseY: 302, wTip: 26, wBase: 28, splay: 0 },
  { cx: 289, tipY: 258, baseY: 314, wTip: 22, wBase: 24, splay: 0 },
];

/** The thumb is thicker and set low, swinging out from the thenar mound. */
export const THUMB: Digit = {
  cx: 130,
  tipY: 342,
  baseY: 414,
  wTip: 20,
  wBase: 24,
  splay: -37,
};

export const HAND_SHAPES = {
  /**
   * The whole hand, traced clockwise from the base of the wrist: out over the
   * heel of the palm, around the thumb, through the web, up and over each
   * finger in turn, then down the outside of the hand back to the wrist.
   */
  outline: [
    "M 168 598",
    "L 162 540",
    // heel of the palm and the thenar, swelling toward the thumb
    "C 158 516 148 500 138 482",
    "C 128 462 112 440 96 418",
    // outer edge of the thumb, up to the tip
    "C 84 402 74 388 70 374",
    "C 64 356 76 342 92 346",
    // and back down its inner edge
    "C 104 350 112 366 120 382",
    "C 128 398 136 410 142 420",
    // the web between thumb and index: a hollow, not a corner
    "C 148 428 154 424 156 412",
    "C 158 396 150 350 148 316",
    // index
    "C 147 290 147 248 148 216",
    "A 15 15 0 0 1 178 216",
    "C 178 240 178 272 179 292",
    // the webbing rises between each pair of fingers
    "C 180 302 186 304 188 296",
    // middle
    "C 190 286 187 246 187 190",
    "A 15.5 15.5 0 0 1 218 190",
    "C 218 240 219 278 220 290",
    "C 221 302 225 304 227 296",
    // ring
    "C 228 286 226 250 227 218",
    "A 15 15 0 0 1 257 218",
    "C 257 246 256 286 256 302",
    "C 258 312 266 314 270 306",
    // little finger
    "C 273 296 275 274 276 258",
    "A 13 13 0 0 1 302 258",
    "C 301 282 295 330 289 352",
    // down the outside of the hand into the wrist
    "C 284 374 281 398 279 420",
    "C 277 446 268 468 256 484",
    "C 247 498 243 516 242 536",
    "L 236 598",
    "Z",
  ].join(" "),

  /** The box that frames the hand tightly, so it fills whatever space it has. */
  viewBox: "54 172 260 440",
};

/* ------------------------------------------------------------------------ */
/* The mehndi                                                               */
/* ------------------------------------------------------------------------ */

/** Centre of the palm, where the gol tikki sits. */
const PALM = { x: 206, y: 400, r: 60 };

function dot(x: number, y: number, r: number) {
  return `M ${R(x)} ${R(y - r)} A ${R(r)} ${R(r)} 0 1 1 ${R(x)} ${R(y + r)} A ${R(r)} ${R(r)} 0 1 1 ${R(x)} ${R(y - r)} Z`;
}

/**
 * The gol tikki: a round motif built outward from a seed, the way it is
 * actually applied. Radii are given against a 192 unit design radius and
 * scaled onto the palm.
 */
function golTikki(): Stroke[] {
  const out: Stroke[] = [];
  const k = PALM.r / 192;
  const s = (n: number) => R(n * k);
  const px = PALM.x;
  const py = PALM.y;
  const spin = (i: number, count: number) =>
    `rotate(${R((360 / count) * i)} ${px} ${py})`;

  out.push({
    d: `M ${px} ${py - s(30)} A ${s(30)} ${s(30)} 0 1 1 ${px} ${py + s(30)} A ${s(30)} ${s(30)} 0 1 1 ${px} ${py - s(30)} Z`,
  });

  for (let i = 0; i < 8; i++) {
    out.push({
      d: `M ${px} ${py - s(36)} C ${px + s(16)} ${py - s(56)} ${px + s(24)} ${py - s(76)} ${px} ${py - s(96)} C ${px - s(24)} ${py - s(76)} ${px - s(16)} ${py - s(56)} ${px} ${py - s(36)} Z`,
      transform: spin(i, 8),
    });
  }
  for (let i = 0; i < 12; i++) {
    out.push({
      d: `M ${px} ${py - s(104)} C ${px + s(22)} ${py - s(124)} ${px + s(26)} ${py - s(146)} ${px} ${py - s(166)} C ${px - s(26)} ${py - s(146)} ${px - s(22)} ${py - s(124)} ${px} ${py - s(104)} Z`,
      transform: spin(i, 12),
    });
  }
  for (let i = 0; i < 12; i++) {
    out.push({
      d: `M ${px} ${py - s(170)} L ${px} ${py - s(182)}`,
      transform: spin(i, 12),
    });
  }
  for (let i = 0; i < 10; i++) {
    out.push({
      d: `M ${px - s(12)} ${py - s(188)} A ${s(13)} ${s(13)} 0 0 1 ${px + s(12)} ${py - s(188)}`,
      transform: spin(i, 10),
    });
  }
  return out;
}

/**
 * A chain of leaves and dots up a digit, with a band at the tip. Drawn in the
 * digit's own upright space, then carried onto it by the same splay rotation.
 */
function digitMehndi(d: Digit): Stroke[] {
  const out: Stroke[] = [];
  const t = digitTransform(d);
  const top = d.tipY + d.wTip * 0.95;
  const bottom = d.baseY + 8;
  const push = (path: string) => out.push({ d: path, transform: t });

  push(
    `M ${R(d.cx - d.wTip / 2 + 3)} ${R(top)} Q ${R(d.cx)} ${R(top - 9)} ${R(d.cx + d.wTip / 2 - 3)} ${R(top)}`
  );
  push(
    `M ${R(d.cx - d.wTip / 2 + 4)} ${R(top + 7)} Q ${R(d.cx)} ${R(top - 1)} ${R(d.cx + d.wTip / 2 - 4)} ${R(top + 7)}`
  );

  const span = bottom - (top + 18);
  const count = Math.max(2, Math.round(span / 26));
  const step = span / count;
  for (let i = 0; i < count; i++) {
    const y = top + 18 + i * step;
    const w = Math.min(8, d.wTip * 0.3);
    const h = step * 0.62;
    push(
      `M ${R(d.cx)} ${R(y)} C ${R(d.cx + w)} ${R(y + h * 0.34)} ${R(d.cx + w)} ${R(y + h * 0.68)} ${R(d.cx)} ${R(y + h)} C ${R(d.cx - w)} ${R(y + h * 0.68)} ${R(d.cx - w)} ${R(y + h * 0.34)} ${R(d.cx)} ${R(y)} Z`
    );
    if (i < count - 1) {
      const dy = y + h + step * 0.16;
      // Kept clear of the edge of the digit, which matters most on the
      // little finger where there is least room.
      const r = 1.9;
      const off = Math.min(w + 2.5, d.wTip / 2 - r - 2.5);
      if (off > w * 0.6) {
        push(dot(d.cx - off, dy, r));
        push(dot(d.cx + off, dy, r));
      }
    }
  }
  return out;
}

/** A scalloped cuff across the wrist. */
function wristBand(): Stroke[] {
  const out: Stroke[] = [];
  const y = 528;
  out.push({ d: `M 165 ${y} Q 202 ${y - 6} 240 ${y}` });
  out.push({ d: `M 165 ${y + 9} Q 202 ${y + 3} 240 ${y + 9}` });
  for (let i = 0; i < 6; i++) {
    const x = 168 + i * 11.7;
    out.push({ d: `M ${x} ${y + 18} A 5.85 5.85 0 0 1 ${x + 11.7} ${y + 18}` });
  }
  for (let i = 0; i < 5; i++) {
    out.push({ d: dot(174 + i * 11.7, y + 30, 1.9) });
  }
  return out;
}

/**
 * Every stroke, ordered the way henna is applied: the palm motif first,
 * spreading outward, then up the fingers and the thumb, and the cuff last.
 */
export function buildHandMehndi(): Stroke[] {
  return [
    ...golTikki(),
    ...FINGERS.flatMap(digitMehndi),
    ...digitMehndi(THUMB),
    ...wristBand(),
  ];
}
