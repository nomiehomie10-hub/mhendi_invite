/**
 * Walks the Mehndi experience in a real browser and captures each chapter.
 * Usage: node scripts/shoot.mjs [width] [height] [label]
 */
import { chromium, devices } from "playwright";
import { mkdir } from "node:fs/promises";

const W = Number(process.argv[2] || 390);
const H = Number(process.argv[3] || 844);
const LABEL = process.argv[4] || `${W}x${H}`;
const REDUCED = process.argv.includes("--reduced");
const BASE = process.env.MEHNDI_URL || "http://localhost:3000";
const OUT = `/tmp/shots/${LABEL}`;

const CHAPTERS = [
  "hero",
  "formal",
  "couple",
  "poster",
  "celebration",
  "timeline",
  "mandala",
  "details",
  "venue",
  "countdown",
  "closing",
];

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
  ...devices["iPhone 13"],
  viewport: { width: W, height: H },
  deviceScaleFactor: 2,
  isMobile: W < 700,
  hasTouch: W < 700,
  reducedMotion: REDUCED ? "reduce" : "no-preference",
});
const page = await ctx.newPage();

const errors = [];
page.on("console", (m) => {
  if (m.type() === "error") errors.push(`console: ${m.text()}`);
});
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
page.on("requestfailed", (r) =>
  errors.push(`requestfailed: ${r.url()} ${r.failure()?.errorText}`)
);

await page.goto(`${BASE}/mehndi`, { waitUntil: "networkidle" });
await page.waitForTimeout(900);
await page.screenshot({ path: `${OUT}/00-entry.png` });

// Tap to enter, then let the doors finish.
await page.locator('button[aria-label="Open the invitation"]').click();
await page.waitForTimeout(REDUCED ? 600 : 2600);
await page.screenshot({ path: `${OUT}/01-hero.png` });

// Walk down the page a chapter at a time, letting each reveal settle.
const sections = await page.locator("main > section").all();
for (let i = 0; i < sections.length; i++) {
  await sections[i].scrollIntoViewIfNeeded();
  await page.waitForTimeout(REDUCED ? 350 : 1700);
  const name = CHAPTERS[i] ?? `section-${i}`;
  await page.screenshot({ path: `${OUT}/${String(i + 2).padStart(2, "0")}-${name}.png` });
}

// A horizontal-overflow check is worth more than any single screenshot.
const overflow = await page.evaluate(() => ({
  scrollW: document.documentElement.scrollWidth,
  clientW: document.documentElement.clientWidth,
}));

console.log(`\n=== ${LABEL}${REDUCED ? " (reduced motion)" : ""} ===`);
console.log(
  `overflow: scrollWidth=${overflow.scrollW} clientWidth=${overflow.clientW}` +
    (overflow.scrollW > overflow.clientW ? "  <-- HORIZONTAL SCROLL" : "  ok")
);
console.log(errors.length ? errors.join("\n") : "console: clean");

await browser.close();
