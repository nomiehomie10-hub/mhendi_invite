"use client";

import { useEffect, useRef, useState } from "react";
import { mehndi } from "@/data/mehndi";
import { useReducedMotion } from "@/lib/mehndi/hooks";
import { Artwork } from "./Artwork";
import { OccasionLockup } from "./OccasionLockup";
import styles from "./MehndiEntry.module.css";

type Props = {
  onEnter: () => void;
};

/**
 * The courtyard entrance. The whole screen is the control: tapping anywhere
 * opens the doors, so there is no button sitting on top of the artwork.
 */
export function CourtyardEntrance({ onEnter }: Props) {
  const [opening, setOpening] = useState(false);
  const [gone, setGone] = useState(false);
  const reduced = useReducedMotion();
  const ref = useRef<HTMLButtonElement>(null);

  // The entrance holds the page still until the guest chooses to come in.
  useEffect(() => {
    if (gone) return;
    const { body } = document;
    const previous = body.style.overflow;
    body.style.overflow = "hidden";
    return () => {
      body.style.overflow = previous;
    };
  }, [gone]);

  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
  }, []);

  const open = () => {
    if (opening) return;
    setOpening(true);
    onEnter();
    // The doors take their time; the hero is already behind them.
    window.setTimeout(() => setGone(true), reduced ? 120 : 2000);
  };

  if (gone) return null;

  return (
    <button
      ref={ref}
      type="button"
      onClick={open}
      aria-label="Enter the courtyard"
      data-opening={opening}
      className={styles.entrance}
    >
      {/* Everything inside the scene moves toward the guest on entry */}
      <span className={styles.scene} aria-hidden="true">
        {/* Warm courtyard light, which blooms as the doors swing */}
        <span className={styles.lightLeak} />
        {/* The doorway artwork, split down the middle so the halves hinge */}
        <span className={styles.doorWrap}>
          <span className={`${styles.door} ${styles.doorLeft}`}>
            <span className={styles.doorInner}>
              <Artwork
                src="/images/mehndi/entry/courtyard-doorway.webp"
                alt=""
                fill
                priority
                sizes="100vw"
                className={styles.doorArt}
              />
            </span>
          </span>
          <span className={`${styles.door} ${styles.doorRight}`}>
            <span className={styles.doorInner}>
              <Artwork
                src="/images/mehndi/entry/courtyard-doorway.webp"
                alt=""
                fill
                priority
                sizes="100vw"
                className={styles.doorArt}
              />
            </span>
          </span>
        </span>
      </span>

      <span className={styles.plate}>
        <OccasionLockup tone="gold" size="md" className={styles.lockup} />
        <span className={styles.names}>
          <span className={`serif ${styles.name}`}>{mehndi.couple.bride}</span>
          <span className={`amp ${styles.amp}`} aria-hidden="true">
            &amp;
          </span>
          <span className={`serif ${styles.name}`}>{mehndi.couple.groom}</span>
        </span>
        <span className={styles.ruleWrap} aria-hidden="true">
          <span className="rule rule--dark" />
        </span>
        <span className={`label ${styles.instruction}`}>
          {mehndi.entry.instruction}
        </span>
      </span>
    </button>
  );
}
