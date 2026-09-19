"use client";

import { mehndi } from "@/data/mehndi";
import { useReveal } from "@/lib/mehndi/hooks";
import { Artwork } from "./Artwork";
import styles from "./SignaturePoster.module.css";

/**
 * The poster. One full-screen composition that should hold up as a
 * screenshot with nothing else around it — a printed Mughal arch with the
 * invitation set inside the opening.
 */
export function SignaturePoster() {
  const { ref, shown } = useReveal<HTMLElement>({ threshold: 0.3 });

  return (
    <section
      ref={ref}
      className={`chapter chapter--full chapter--deep ${styles.section}`}
      aria-label={`Mehndi Night — ${mehndi.couple.bride} and ${mehndi.couple.groom}`}
    >
      <div className={styles.frame}>
        <Artwork
          src="/images/mehndi/poster/signature-arch-frame.webp"
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, 560px"
          className={styles.frameArt}
        />
      </div>

      <div className={`${styles.inscription} wash`} data-shown={shown}>
        <p className={`label ${styles.eyebrow}`}>{mehndi.entry.eyebrow}</p>

        <span className={styles.ruleWrap} aria-hidden="true">
          <span className="rule" />
        </span>

        <p className={styles.names}>
          <span className={`serif ${styles.name}`}>{mehndi.couple.bride}</span>
          <span className={`amp ${styles.amp}`} aria-hidden="true">
            &amp;
          </span>
          <span className={`serif ${styles.name}`}>{mehndi.couple.groom}</span>
        </p>

        <span className={styles.ruleWrap} aria-hidden="true">
          <span className="rule" />
        </span>

        <p className={`label ${styles.meta}`}>
          <span>{mehndi.displayDate}</span>
          <span className={styles.city}>{mehndi.venue.city}</span>
        </p>
      </div>
    </section>
  );
}
