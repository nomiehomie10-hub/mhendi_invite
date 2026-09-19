# Mehndi Courtyard

A digital invitation for the **Nikah & Mehndi** of **Dr Sobia Mariam & Farhan
Ullah Khan** — Friday 09 October 2026, Creek Club, DHA Phase VIII, Karachi.

The guest does not browse a wedding site; they tap a courtyard door open and
walk through the evening. It is designed for an iPhone first (390 × 844) and
becomes a centred invitation on a dark canvas at desktop widths.

It is one night carrying two occasions, and the design says so. "Nikah" is set
in small spaced capitals and "Mehndi" in a large sloped serif, joined by a
hairline rule — one lockup, used at the entry, the hero, the poster and the
close. The running order carries the same idea: the first half runs brass and
green, and at the point the vows are made the spine of the timeline turns
marigold and the celebration begins.

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

Entry → Hero → Formal Invitation → The Note → Signature Poster → Celebration →
The Night → Apply the Mehndi → Details → Venue → Countdown → Closing.

**Formal Invitation** is the printed-card wording: who is invited, to what, and
on whose behalf, with both sets of parents named. It takes the couple's names
from `couple` rather than keeping its own copy, so the two can never drift
apart. **The Note** follows it in the wreath — the warm line to friends and
family, which is all the wreath's opening has room for.

Each chapter is a room in the same courtyard, and the colour moves through
green → ivory → green → saffron → ivory → skin → rose → dusk → green → ivory.

Every chapter does a job no other chapter does. The names appear in four
places and each one is a different act: a plate at the door, the arrival, the
formal record on the poster, a signature at the close. The date and venue are
set once on the poster and once in the details, and nowhere else.

**Apply the Mehndi** is the one screen the guest does something on. A gol tikki
— the round motif that goes on the palm — is shown as a faint stencil, and
pressing and holding draws it on in henna from the centre outward. Under
reduced motion it arrives already drawn, and a "Fill it in" control covers
anyone who cannot hold a pointer down.

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

## Save the date

The details chapter builds an `.ics` file in the browser from `data/mehndi.ts`,
so there is no endpoint to deploy and the calendar entry can never drift from
the invitation.

## Music

Ambient audio is optional and **no track is committed**. Drop one at
`public/audio/mehndi.mp3` (the path is `audio.src` in `data/mehndi.ts`, and any
format the browser plays will do) and a small brass control appears at the
bottom-right after the guest enters, fading in over about two and a half
seconds. With no file, the control never renders and nothing breaks.

The audio element is only constructed after the entry tap, which is what lets
iOS play it at all. Verified end to end with a temporary tone: hidden before
entry, playing after, toggling correctly, 44 × 44px.

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

Verified at 375, 390, 393, 430, 768 and 1440 with no horizontal overflow, no
wrapped names, a clean console, and no broken images when an asset is absent.
