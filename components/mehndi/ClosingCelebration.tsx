"use client";

import { mehndi } from "@/data/mehndi";
import { useReducedMotion, useReveal } from "@/lib/mehndi/hooks";
import { Artwork } from "./Artwork";
import styles from "./ClosingCelebration.module.css";

/** A few petals lifting out of the closing garden. */
const PETALS = [
  { left: "12%", delay: "0s", drift: "18px", spin: "120deg", size: 7 },
  { left: "28%", delay: "2.6s", drift: "-14px", spin: "-90deg", size: 5 },
  { left: "51%", delay: "1.3s", drift: "22px", spin: "160deg", size: 8 },
  { left: "70%", delay: "3.9s", drift: "-19px", spin: "-140deg", size: 6 },
  { left: "86%", delay: "5.2s", drift: "12px", spin: "100deg", size: 5 },
];

/**
 * The courtyard after the celebration. The botanical frame grows up from
 * the bottom of the screen and the last words sit in the quiet above it.
 */
export function ClosingCelebration() {
  const { ref, shown } = useReveal<HTMLElement>({ threshold: 0.28 });
  const reduced = useReducedMotion();

  return (
    <section
      ref={ref}
      className={`chapter chapter--full chapter--ivory paper ${styles.section}`}
      aria-labelledby="closing-heading"
    >
      <div className={`${styles.garden} wash`} data-shown={shown} aria-hidden="true">
        <Artwork
          src="/images/mehndi/closing/ivory-floral-frame.webp"
          alt=""
          width={941}
          height={1672}
          sizes="(max-width: 640px) 100vw, 560px"
          className={styles.gardenArt}
        />
      </div>

      {!reduced && (
        <div className={styles.petals} aria-hidden="true">
          {PETALS.map((petal) => (
            <span
              key={petal.left}
              className={styles.petal}
              style={
                {
                  left: petal.left,
                  width: petal.size,
                  height: petal.size,
                  animationDelay: petal.delay,
                  "--drift": petal.drift,
                  "--spin": petal.spin,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      )}

      <div className={`stage ${styles.stage}`}>
        <h2 id="closing-heading" className={styles.headline}>
          {mehndi.closing.headline.map((line, i) => (
            <span
              key={line}
              className={`display ${styles.line} reveal`}
              data-shown={shown}
              style={{ "--reveal-delay": `${i * 160}ms` } as React.CSSProperties}
            >
              {line}
            </span>
          ))}
        </h2>

        <p
          className={`${styles.names} reveal`}
          data-shown={shown}
          style={{ "--reveal-delay": "400ms" } as React.CSSProperties}
        >
          <span className={`serif ${styles.name}`}>{mehndi.couple.bride}</span>
          <span className={`amp ${styles.amp}`} aria-hidden="true">
            &amp;
          </span>
          <span className={`serif ${styles.name}`}>{mehndi.couple.groom}</span>
        </p>

        <div
          className={`${styles.signoff} reveal`}
          data-shown={shown}
          style={{ "--reveal-delay": "540ms" } as React.CSSProperties}
        >
          <span className={styles.signoffText}>{mehndi.closing.signoff}</span>
          <span className={styles.mark} aria-hidden="true">
            <svg viewBox="0 0 28 14" width="28" height="14" fill="none">
              <path
                d="M1 7h8M19 7h8"
                stroke="currentColor"
                strokeWidth="0.9"
                strokeLinecap="round"
              />
              <path
                d="M14 2.6c1.6 1.5 2.6 2.9 2.6 4.1A2.6 2.6 0 0 1 14 9.3a2.6 2.6 0 0 1-2.6-2.6c0-1.2 1-2.6 2.6-4.1Z"
                fill="currentColor"
              />
            </svg>
          </span>
        </div>
      </div>
    </section>
  );
}
