/**
 * The geometry of a hand with bridal mehndi on it.
 *
 * Everything here is pure arithmetic from fixed constants: the server and the
 * client generate identical markup, and nothing depends on measurement.
 *
 * The hand is drawn palm-up in a 400 x 620 box. It is built from separate
 * overlapping shapes — palm, four fingers, thumb, wrist — rather than one
 * outline, because a union of simple tapered forms reads as a slender hand
 * far more reliably than a single hand-authored contour.
 */

export type Stroke = { d: string; rotate?: number; cx?: number; cy?: number };

const R = (n: number) => Math.round(n * 100) / 100;

/** A finger: wide at the knuckle, narrowing to a rounded tip. */
function finger(cx: number, tipY: number, baseY: number, wTip: number, wBase: number) {
  const tipR = wTip / 2;
  const midY = (baseY + tipY) / 2;
  return [
    `M ${R(cx - wBase / 2)} ${R(baseY)}`,
    `Q ${R(cx - wTip / 2 - 1.5)} ${R(midY)} ${R(cx - tipR)} ${R(tipY + tipR)}`,
    `A ${R(tipR)} ${R(tipR)} 0 0 1 ${R(cx + tipR)} ${R(tipY + tipR)}`,
    `Q ${R(cx + wTip / 2 + 1.5)} ${R(midY)} ${R(cx + wBase / 2)} ${R(baseY)}`,
    "Z",
  ].join(" ");
}

/** Slim fingers, a narrow palm and a fine wrist. */
export const FINGERS = [
  { name: "index", cx: 159, tipY: 150, baseY: 322, wTip: 24, wBase: 30 },
  { name: "middle", cx: 198, tipY: 120, baseY: 322, wTip: 25, wBase: 31 },
  { name: "ring", cx: 236, tipY: 144, baseY: 322, wTip: 24, wBase: 30 },
  { name: "pinky", cx: 269, tipY: 198, baseY: 330, wTip: 20, wBase: 26 },
] as const;

export const THUMB = {
  cx: 140,
  tipY: 318,
  baseY: 474,
  wTip: 26,
  wBase: 42,
  rotate: -37,
  originX: 152,
  originY: 428,
};

/**
 * The filled shapes that make up the hand. They are drawn with no stroke and
 * one shared fill, so the overlaps merge into a single silhouette instead of
 * reading as parts bolted together.
 */
export const HAND_SHAPES = {
  /** Palm and wrist as one contour, tapering from the knuckles to the arm. */
  palm:
    "M 128 306 " +
    "C 128 270 148 258 172 256 " +
    "C 200 252 232 254 252 258 " +
    "C 272 262 280 276 280 302 " +
    "L 281 392 " +
    "C 281 428 268 448 256 462 " +
    "C 250 470 246 478 245 490 " +
    "L 240 578 " +
    "C 239 590 228 594 200 594 " +
    "C 172 594 161 590 160 578 " +
    "L 155 490 " +
    "C 154 478 150 470 144 462 " +
    "C 132 448 126 428 126 392 " +
    "Z",
  fingers: FINGERS.map((f) => finger(f.cx, f.tipY, f.baseY, f.wTip, f.wBase)),
  thumb: finger(THUMB.cx, THUMB.tipY, THUMB.baseY, THUMB.wTip, THUMB.wBase),
};

/* ------------------------------------------------------------------------ */
/* The mehndi                                                               */
/* ------------------------------------------------------------------------ */

/** Centre of the palm, where the gol tikki sits. */
const PALM = { x: 201, y: 372, r: 62 };

/**
 * The gol tikki: a round motif built outward from a seed, the way it is
 * actually applied. Radii are given against a 192 unit design radius and
 * scaled down onto the palm.
 */
function golTikki(): Stroke[] {
  const out: Stroke[] = [];
  const k = PALM.r / 192;
  const s = (n: number) => R(n * k);

  const ring = (count: number, make: (i: number) => string) => {
    for (let i = 0; i < count; i++) {
      out.push({ d: make(i), rotate: (360 / count) * i, cx: PALM.x, cy: PALM.y });
    }
  };
  const px = PALM.x;
  const py = PALM.y;

  out.push({
    d: `M ${px} ${py - s(30)} A ${s(30)} ${s(30)} 0 1 1 ${px} ${py + s(30)} A ${s(30)} ${s(30)} 0 1 1 ${px} ${py - s(30)} Z`,
  });

  ring(8, () =>
    `M ${px} ${py - s(36)} C ${px + s(16)} ${py - s(56)} ${px + s(24)} ${py - s(76)} ${px} ${py - s(96)} C ${px - s(24)} ${py - s(76)} ${px - s(16)} ${py - s(56)} ${px} ${py - s(36)} Z`
  );

  ring(12, () =>
    `M ${px} ${py - s(104)} C ${px + s(22)} ${py - s(124)} ${px + s(26)} ${py - s(146)} ${px} ${py - s(166)} C ${px - s(26)} ${py - s(146)} ${px - s(22)} ${py - s(124)} ${px} ${py - s(104)} Z`
  );

  ring(12, () =>
    `M ${px} ${py - s(170)} L ${px} ${py - s(182)}`
  );

  ring(10, () =>
    `M ${px - s(12)} ${py - s(188)} A ${s(13)} ${s(13)} 0 0 1 ${px + s(12)} ${py - s(188)}`
  );

  return out;
}

/** A chain of leaves and dots running up a finger, with a band at the tip. */
function fingerMehndi(
  cx: number,
  tipY: number,
  baseY: number,
  wTip: number
): Stroke[] {
  const out: Stroke[] = [];
  const top = tipY + wTip * 0.9;
  const bottom = baseY - 16;

  // the tip band
  out.push({
    d: `M ${R(cx - wTip / 2 + 3)} ${R(top)} Q ${R(cx)} ${R(top - 9)} ${R(cx + wTip / 2 - 3)} ${R(top)}`,
  });
  out.push({
    d: `M ${R(cx - wTip / 2 + 4)} ${R(top + 7)} Q ${R(cx)} ${R(top - 1)} ${R(cx + wTip / 2 - 4)} ${R(top + 7)}`,
  });

  // a chain of leaves down the length of the finger
  const span = bottom - (top + 18);
  const count = Math.max(2, Math.round(span / 30));
  const step = span / count;
  for (let i = 0; i < count; i++) {
    const y = top + 18 + i * step;
    const w = 7.5;
    const h = step * 0.62;
    out.push({
      d: `M ${R(cx)} ${R(y)} C ${R(cx + w)} ${R(y + h * 0.34)} ${R(cx + w)} ${R(y + h * 0.68)} ${R(cx)} ${R(y + h)} C ${R(cx - w)} ${R(y + h * 0.68)} ${R(cx - w)} ${R(y + h * 0.34)} ${R(cx)} ${R(y)} Z`,
    });
    // a dot either side of each joint
    const dy = y + h + step * 0.16;
    if (i < count - 1) {
      out.push({ d: dot(cx - w - 2.5, dy, 2) });
      out.push({ d: dot(cx + w + 2.5, dy, 2) });
    }
  }
  return out;
}

function dot(x: number, y: number, r: number) {
  return `M ${R(x)} ${R(y - r)} A ${R(r)} ${R(r)} 0 1 1 ${R(x)} ${R(y + r)} A ${R(r)} ${R(r)} 0 1 1 ${R(x)} ${R(y - r)} Z`;
}

/** A scalloped cuff across the wrist. */
function wristBand(): Stroke[] {
  const out: Stroke[] = [];
  const y = 502;
  out.push({ d: `M 161 ${y} Q 200 ${y - 6} 241 ${y}` });
  out.push({ d: `M 161 ${y + 9} Q 200 ${y + 3} 241 ${y + 9}` });
  for (let i = 0; i < 6; i++) {
    const x = 165 + i * 12.2;
    out.push({ d: `M ${x} ${y + 18} A 6.1 6.1 0 0 1 ${x + 12.2} ${y + 18}` });
  }
  for (let i = 0; i < 5; i++) {
    out.push({ d: dot(171 + i * 12.2, y + 30, 2) });
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
    ...FINGERS.flatMap((f) => fingerMehndi(f.cx, f.tipY, f.baseY, f.wTip)),
    ...fingerMehndi(THUMB.cx, THUMB.tipY, THUMB.baseY, THUMB.wTip).map((s) => ({
      ...s,
      rotate: THUMB.rotate,
      cx: THUMB.originX,
      cy: THUMB.originY,
    })),
    ...wristBand(),
  ];
}
