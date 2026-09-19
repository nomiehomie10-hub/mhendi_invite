"use client";

import { mehndi } from "@/data/mehndi";
import styles from "./OccasionLockup.module.css";

type Props = {
  /** `gold` sits on the dark chapters, `ink` on the pale ones. */
  tone?: "gold" | "ink";
  size?: "sm" | "md" | "lg";
  className?: string;
};

/**
 * "Nikah & Mehndi" — the mark this invitation is built around.
 *
 * The two halves of the night are set differently on purpose: the Nikah in
 * small, spaced, upright capitals, the Mehndi in a large sloped serif. The
 * ceremony and the celebration in one line, which is exactly what the evening
 * is. It appears at the entry, the hero, the poster and the close, so the
 * pairing reads as an identity rather than a label repeated four times.
 */
export function OccasionLockup({ tone = "gold", size = "md", className }: Props) {
  const { first, second, joiner } = mehndi.occasion;

  return (
    <span
      className={`${styles.lockup} ${className ?? ""}`}
      data-tone={tone}
      data-size={size}
    >
      <span className={`label ${styles.first}`}>{first}</span>
      <span className={styles.joinerWrap} aria-hidden="true">
        <span className={styles.hair} />
        <span className={`amp ${styles.joiner}`}>{joiner}</span>
        <span className={styles.hair} />
      </span>
      <span className={`serif ${styles.second}`}>{second}</span>
    </span>
  );
}
