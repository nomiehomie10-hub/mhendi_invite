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
        <div ref={wreath} className={styles.wreathWrap}>
          <div
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
            className={`${styles.invitation} reveal`}
            data-shown={shown}
            style={{ "--reveal-delay": "420ms" } as React.CSSProperties}
          >
            {mehndi.couplePanel.body}
          </h2>
        </div>

      </div>
    </section>
  );
}
