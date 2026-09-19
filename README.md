# Mehndi Courtyard

A digital invitation for the Mehndi of **Sobia Mariam & Farhan Ullah Khan** —
09 January 2027, Dubai.

The guest does not browse a wedding site; they tap to open a courtyard door and
walk through the evening. It is designed for an iPhone first (390 × 844) and
becomes a centred invitation on a dark canvas at desktop widths.

## Running it

```bash
npm install
npm run dev          # http://localhost:3000/mehndi
```

`/` redirects to `/mehndi`.

## Layout

```
app/mehndi/            route + fonts + metadata for the experience
components/mehndi/     one component per chapter, each with its own CSS module
data/mehndi.ts         all content: names, date, venue, events, dress code
lib/mehndi/hooks.ts    reveal, parallax, countdown, reduced-motion
styles/mehndi.css      design tokens, material language, motion primitives
public/images/mehndi/  processed artwork, by chapter
scripts/               asset pipeline and the screenshot harness
_source-assets/        the original supplied artwork (input to the pipeline)
```

Everything a guest reads lives in `data/mehndi.ts`. Components never hardcode
content, so changing a time or the venue is a one-line edit.

## The chapters

Entry → Hero → The Couple → Signature Poster → Celebration → The Night →
Details → Venue → Countdown → Closing.

Each chapter is a room in the same courtyard, and the colour moves through
green → ivory → green → saffron → ivory → rose → dusk → green → ivory.

## Artwork

`npm run assets` rebuilds `public/images/mehndi/` from `_source-assets/`.

The supplied art arrived in several states, and the pipeline normalises each
one so it can sit on any background:

- **matted on black** (arch frame, corner spray) — alpha recovered from the
  brightest channel and the colour unpremultiplied, so edges stay clean
- **haloed cut-out** (garland canopy) — the pale glow is a wide band of partial
  alpha, removed by remapping alpha steeply around the artwork's own opacity
- **transparency checkerboard** (wreath) — flattened to white, cropped, keyed
- **printed on ivory paper** (timeline icons, Mughal border) — the ground is
  keyed to transparency by RGB distance

Keying is used rather than `mix-blend-mode: multiply` because several of these
pieces sit inside transformed or z-indexed wrappers, and a stacking context
traps a blend so it never reaches the page behind it.

## Music

Ambient audio is optional. Drop a file at `public/audio/mehndi.mp3` and a small
brass control appears after the guest enters; with no file, nothing is shown
and nothing breaks. Audio is only created after the entry tap, which is what
lets iOS play it.

## Accessibility

`prefers-reduced-motion` removes parallax, the curtain animation and the
drifting petals while keeping every word on the page. Interactive elements meet
44 × 44px, carry labels and have visible focus. A chapter scrolled past without
an intersection callback still reveals itself, so content is never stranded
invisible.

## Checking it

```bash
MEHNDI_URL=http://localhost:3000 \
  node scripts/shoot.mjs 390 844 iphone390      # walks the journey, flags
node scripts/shoot.mjs 390 844 reduced --reduced #   overflow + console errors
```

Verified at 375, 390, 393, 430, 768 and 1440 with no horizontal overflow and a
clean console.
