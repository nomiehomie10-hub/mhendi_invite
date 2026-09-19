"use client";

import { mehndi } from "@/data/mehndi";
import { useParallax } from "@/lib/mehndi/hooks";
import { Artwork } from "./Artwork";
import { OccasionLockup } from "./OccasionLockup";
import styles from "./MehndiHero.module.css";

/**
 * Stepping inside. The courtyard fills the screen and drifts at three
 * different depths as the guest scrolls — slowly enough to read as air
 * rather than movement.
 */
export function MehndiHero({ entered }: { entered: boolean }) {
  const background = useParallax<HTMLDivElement>(0.1);
  const midground = useParallax<HTMLDivElement>(0.15);
  const foreground = useParallax<HTMLDivElement>(0.22);

  return (
    <section
      className={`chapter chapter--full chapter--green pigment ${styles.hero}`}
      data-entered={entered}
      aria-label={`${mehndi.occasion.first} & ${mehndi.occasion.second}`}
    >
      <div ref={background} className={styles.bg}>
        <Artwork
          src="/images/mehndi/hero/courtyard-golden-hour.webp"
          alt=""
          fill
          priority
          sizes="(max-width: 640px) 100vw, 560px"
          className={styles.bgArt}
        />
        <span className={styles.bgVeil} aria-hidden="true" />
      </div>

      <div ref={midground} className={`${styles.canopy} sway`} aria-hidden="true">
        <Artwork
          src="/images/mehndi/botanical/garland-canopy.webp"
          alt=""
          width={852}
          height={758}
          sizes="(max-width: 640px) 120vw, 620px"
          className={styles.canopyArt}
        />
      </div>

      <div className={`stage ${styles.plate}`}>
        <div className={styles.eyebrow}>
          <OccasionLockup tone="gold" size="lg" />
        </div>

        <h1 className={styles.headline}>
          <span className={`name ${styles.first}`}>{mehndi.couple.bride}</span>
          <span className={`amp ${styles.amp}`} aria-hidden="true">
            {mehndi.hero.ampersand}
          </span>
          <span className={`name ${styles.second}`}>{mehndi.couple.groom}</span>
        </h1>

        <div className={styles.foot}>
          <span className="rule rule--dark" aria-hidden="true" />
          <p className={`label ${styles.meta}`}>{mehndi.hero.footer}</p>
        </div>
      </div>

      <div ref={foreground} className={styles.lanterns} aria-hidden="true">
        <span className="lantern-glow">
          <Artwork
            src="/images/mehndi/botanical/lantern-cluster.webp"
            alt=""
            width={1022}
            height={1539}
            sizes="220px"
            className={styles.lanternArt}
          />
        </span>
      </div>

      <span className={`seam seam--bottom ${styles.seamOut}`} aria-hidden="true" />
    </section>
  );
}
