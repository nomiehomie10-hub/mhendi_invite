"use client";

import { mehndi } from "@/data/mehndi";
import { useParallax, useReveal } from "@/lib/mehndi/hooks";
import { Artwork } from "./Artwork";
import styles from "./CelebrationSection.module.css";

/**
 * A saffron room given over almost entirely to the painting. It carries
 * feeling, not information — the words get out of the artwork's way.
 */
export function CelebrationSection() {
  const { ref, shown } = useReveal<HTMLElement>({ threshold: 0.22 });
  const art = useParallax<HTMLDivElement>(0.1);

  return (
    <section
      ref={ref}
      className={`chapter chapter--saffron pigment ${styles.section}`}
      aria-labelledby="celebration-heading"
    >
      <span className={`seam seam--top ${styles.seamIn}`} aria-hidden="true" />

      <div className={`stage ${styles.stage}`}>
        <p className={`label ${styles.eyebrow} reveal`} data-shown={shown}>
          {mehndi.celebration.eyebrow}
        </p>

        <h2
          id="celebration-heading"
          className={`display ${styles.headline} reveal`}
          data-shown={shown}
          style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
        >
          {mehndi.celebration.headline}
        </h2>

        <div
          ref={art}
          className={`${styles.artWrap} wash`}
          data-shown={shown}
          style={{ "--reveal-delay": "260ms" } as React.CSSProperties}
        >
          <Artwork
            src="/images/mehndi/celebration/courtyard-dance.webp"
            alt=""
            width={941}
            height={1672}
            sizes="(max-width: 640px) 100vw, 520px"
            className={styles.art}
          />
        </div>
      </div>

      <span className={`seam seam--bottom ${styles.seamOut}`} aria-hidden="true" />
    </section>
  );
}
