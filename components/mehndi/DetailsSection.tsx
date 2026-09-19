"use client";

import { mehndi } from "@/data/mehndi";
import { useReveal } from "@/lib/mehndi/hooks";
import { Artwork } from "./Artwork";
import styles from "./DetailsSection.module.css";

/**
 * The facts, set like an engraved plate rather than stacked into cards.
 * A painted Mughal border runs across the top of the chapter and the
 * information hangs beneath it.
 */
export function DetailsSection() {
  const { ref, shown } = useReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      className={`chapter chapter--rose paper ${styles.section}`}
      aria-labelledby="details-heading"
    >
      <span className={`seam seam--top ${styles.seamIn}`} aria-hidden="true" />

      <div className={`${styles.borderWrap} wash`} data-shown={shown}>
        <Artwork
          src="/images/mehndi/ornament/mughal-border.webp"
          alt=""
          width={1600}
          height={582}
          sizes="(max-width: 640px) 140vw, 720px"
          className={styles.border}
        />
      </div>

      <div className={`stage ${styles.stage}`}>
        <h2
          id="details-heading"
          className={`label ${styles.eyebrow} reveal`}
          data-shown={shown}
        >
          The Details
        </h2>

        <dl className={styles.list}>
          {mehndi.details.map((detail, i) => (
            <div
              key={detail.label}
              className={`${styles.row} reveal`}
              data-shown={shown}
              style={
                { "--reveal-delay": `${140 + i * 110}ms` } as React.CSSProperties
              }
            >
              <dt className={`label ${styles.label}`}>{detail.label}</dt>
              <dd className={styles.value}>
                <span className={`serif ${styles.valueText}`}>{detail.value}</span>
                {detail.note && (
                  <span className={styles.note}>{detail.note}</span>
                )}
              </dd>
            </div>
          ))}
        </dl>

        <p
          className={`${styles.dressNote} reveal`}
          data-shown={shown}
          style={{ "--reveal-delay": "600ms" } as React.CSSProperties}
        >
          {mehndi.dressCodeNote}
        </p>
      </div>
    </section>
  );
}
