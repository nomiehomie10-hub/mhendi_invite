"use client";

import { mehndi } from "@/data/mehndi";
import { useParallax, useReveal } from "@/lib/mehndi/hooks";
import { Artwork } from "./Artwork";
import styles from "./CoupleSection.module.css";

/**
 * The couple, held inside a painted botanical wreath. The wreath is printed
 * onto the paper with a multiply blend, so its own ivory ground disappears
 * and the pigment sits in the page rather than on top of it.
 */
export function CoupleSection() {
  const { ref, shown } = useReveal<HTMLElement>();
  const wreath = useParallax<HTMLDivElement>(0.06);

  return (
    <section
      ref={ref}
      className={`chapter chapter--ivory paper ${styles.section}`}
      aria-labelledby="couple-heading"
    >
      <div className={`stage ${styles.stage}`}>
        <p
          className={`label ${styles.eyebrow} reveal`}
          data-shown={shown}
          style={{ "--reveal-delay": "0ms" } as React.CSSProperties}
        >
          {mehndi.couplePanel.eyebrow}
        </p>

        <div className={styles.wreathWrap}>
          <div
            ref={wreath}
            className={`${styles.wreath} wash`}
            data-shown={shown}
            style={{ "--reveal-delay": "140ms" } as React.CSSProperties}
            aria-hidden="true"
          >
            <Artwork
              src="/images/mehndi/botanical/marigold-wreath.webp"
              alt=""
              width={900}
              height={1050}
              sizes="(max-width: 640px) 96vw, 520px"
              className={styles.wreathArt}
            />
          </div>

          <h2
            id="couple-heading"
            className={`${styles.names} reveal`}
            data-shown={shown}
            style={{ "--reveal-delay": "420ms" } as React.CSSProperties}
          >
            <span className={`serif ${styles.name}`}>{mehndi.couple.bride}</span>
            <span className={`amp ${styles.amp}`} aria-hidden="true">
              &amp;
            </span>
            <span className={`serif ${styles.name}`}>{mehndi.couple.groom}</span>
          </h2>
        </div>

        <p
          className={`body ${styles.body} reveal`}
          data-shown={shown}
          style={{ "--reveal-delay": "560ms" } as React.CSSProperties}
        >
          {mehndi.couplePanel.body}
        </p>
      </div>
    </section>
  );
}
