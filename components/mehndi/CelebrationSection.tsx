"use client";

import { mehndi } from "@/data/mehndi";
import { useParallax, useReveal } from "@/lib/mehndi/hooks";
import { Artwork } from "./Artwork";
import styles from "./CelebrationSection.module.css";

/**
 * A saffron room given over almost entirely to the painting.
 *
 * The words sit inside the illustration's open sky rather than above it, so
 * the empty part of the artwork becomes the page's breathing room instead of
 * dead space with a headline stranded over it.
 */
export function CelebrationSection() {
  const { ref, shown } = useReveal<HTMLElement>({ threshold: 0.2 });
  const art = useParallax<HTMLDivElement>(0.07);

  return (
    <section
      ref={ref}
      className={`chapter chapter--full chapter--saffron ${styles.section}`}
      aria-labelledby="celebration-heading"
    >
      <span className={`seam seam--top ${styles.seamIn}`} aria-hidden="true" />

      <div ref={art} className={`${styles.artWrap} wash`} data-shown={shown}>
        <Artwork
          src="/images/mehndi/celebration/dance.webp"
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, 560px"
          className={styles.art}
        />
      </div>

      <div className={`stage ${styles.stage}`}>
        <p className={`label ${styles.eyebrow} reveal`} data-shown={shown}>
          {mehndi.celebration.eyebrow}
        </p>

        <h2 id="celebration-heading" className={styles.headline}>
          {mehndi.celebration.headline.map((line, i) => (
            <span
              key={line}
              className={`${styles.line} reveal`}
              data-shown={shown}
              style={
                { "--reveal-delay": `${140 + i * 150}ms` } as React.CSSProperties
              }
            >
              {line}
            </span>
          ))}
        </h2>
      </div>

      <span className={`seam seam--bottom ${styles.seamOut}`} aria-hidden="true" />
    </section>
  );
}
